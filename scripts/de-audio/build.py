"""
Builds the German audio for the app from scripts/de-audio/texts.json.

  1. Single words  → native-speaker recordings from Wiktionary / Wikimedia Commons
                     (real people, CC BY-SA etc. — credited on /de/kredit).
  2. Everything    → Piper TTS with the "Thorsten" voice (a real German speaker's
                     open CC0 dataset), used for sentences and as word fallback.

Output: public/audio/de/{native,tts}/*.mp3 and lib/de/audio-manifest.json

Requirements (not part of the app): Python 3.12 with `piper-tts`, ffmpeg on PATH,
and the voice files de_DE-thorsten-high.onnx(.json) from
https://huggingface.co/rhasspy/piper-voices/tree/v1.0.0/de/de_DE/thorsten/high

  python scripts/de-audio/build.py --voice path/to/de_DE-thorsten-high.onnx
"""

import argparse
import hashlib
import html
import json
import re
import subprocess
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEXTS = Path(__file__).with_name("texts.json")
OUT = ROOT / "public" / "audio" / "de"
MANIFEST = ROOT / "lib" / "de" / "audio-manifest.json"
UA = {"User-Agent": "HafalinMVP/0.1 (educational prototype)"}

# Trim leading/trailing silence and even out loudness so clips feel consistent.
AF = (
    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
    "loudnorm=I=-16:TP=-1.5:LRA=11,adelay=60|60,apad=pad_dur=0.12"
)


def to_mp3(src: Path, dst: Path):
    dst.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-af", AF, "-ac", "1", "-ar", "44100", "-b:a", "64k", str(dst)],
        check=True,
    )


def fetch(url: str, tries: int = 6) -> bytes:
    """GET with polite backoff on 429/5xx (Wikimedia rate limits)."""
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code not in (429, 500, 502, 503) or attempt == tries - 1:
                raise
            wait = int(e.headers.get("Retry-After") or 0) or 2 ** (attempt + 2)
            print(f"  {e.code}, waiting {wait}s")
            time.sleep(wait)
    raise RuntimeError("unreachable")


def api(url: str, **params):
    q = urllib.parse.urlencode({**params, "format": "json"})
    return json.loads(fetch(f"{url}?{q}"))


def pick_recording(lemma: str, files: list[str]) -> str | None:
    """Prefer the standard German file (De-Wort.ogg), then numbered takes, then Lingua Libre."""
    names = [f.split(":", 1)[1] for f in files]
    w = re.escape(lemma)
    patterns = [
        rf"^De-{w}\.(ogg|oga|wav|mp3|flac)$",
        rf"^De-{w}\d\.(ogg|oga|wav|mp3|flac)$",
        rf"^LL-Q188 \(deu\)-[^-]+-{w}\.(wav|ogg)$",
    ]
    for pat in patterns:
        for n in names:
            if re.match(pat, n, re.IGNORECASE):
                return n
    return None


def strip_html(s: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def fetch_native(lemmas: list[str]) -> dict[str, dict]:
    found: dict[str, dict] = {}
    for i in range(0, len(lemmas), 40):
        batch = lemmas[i : i + 40]
        d = api("https://de.wiktionary.org/w/api.php", action="query", titles="|".join(batch), prop="images", imlimit=500)
        for p in d["query"]["pages"].values():
            files = [im["title"] for im in p.get("images", [])]
            name = pick_recording(p["title"], files)
            if name:
                found[p["title"]] = {"file": name}
        time.sleep(0.5)

    by_file = {info["file"]: lemma for lemma, info in found.items()}
    names = list(by_file)
    for i in range(0, len(names), 40):
        d = api(
            "https://commons.wikimedia.org/w/api.php",
            action="query",
            titles="|".join(f"File:{n}" for n in names[i : i + 40]),
            prop="imageinfo",
            iiprop="url|extmetadata",
        )
        for page in d["query"]["pages"].values():
            ii = (page.get("imageinfo") or [None])[0]
            fname = page["title"].split(":", 1)[1]
            lemma = by_file.get(fname) or by_file.get(fname.replace(" ", "_"))
            if not ii or not lemma:
                continue
            meta = ii.get("extmetadata", {})
            found[lemma].update(
                url=ii["url"],
                page=ii.get("descriptionurl"),
                author=strip_html(meta.get("Artist", {}).get("value", "")) or "Wikimedia Commons",
                license=strip_html(meta.get("LicenseShortName", {}).get("value", "")),
            )
        time.sleep(1)
    return {k: v for k, v in found.items() if "url" in v}


def slug(s: str) -> str:
    t = s.lower().translate(str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss"}))
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", required=True)
    ap.add_argument("--length-scale", type=float, default=1.08, help=">1 = a bit slower, clearer for learners")
    ap.add_argument("--no-native", action="store_true")
    args = ap.parse_args()

    from piper import PiperVoice, SynthesisConfig

    items = json.loads(TEXTS.read_text(encoding="utf-8"))
    old = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
    manifest: dict[str, dict] = {}

    # 1) native recordings
    native = {}
    if not args.no_native:
        lemmas = sorted({it["lemma"] for it in items if it.get("lemma")})
        native = fetch_native(lemmas)
        print(f"native recordings: {len(native)}/{len(lemmas)}")

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        for lemma, info in native.items():
            dst = OUT / "native" / f"{slug(lemma)}.mp3"
            if not dst.exists():
                raw = tmp / ("n" + Path(urllib.parse.urlparse(info["url"]).path).suffix)
                raw.write_bytes(fetch(info["url"]))
                to_mp3(raw, dst)
                time.sleep(1.5)
            info["src"] = f"/audio/de/native/{dst.name}"

        # 2) Piper TTS for every text
        voice = PiperVoice.load(args.voice)
        cfg = SynthesisConfig(length_scale=args.length_scale, noise_scale=0.6, noise_w_scale=0.8)
        for n, it in enumerate(items, 1):
            key = it["key"]
            h = hashlib.sha1(f"{key}|{args.length_scale}".encode()).hexdigest()[:12]
            dst = OUT / "tts" / f"{h}.mp3"
            if not dst.exists():
                wav = tmp / "t.wav"
                with wave.open(str(wav), "wb") as wf:
                    voice.synthesize_wav(key, wf, syn_config=cfg)
                to_mp3(wav, dst)
            entry = {"tts": f"/audio/de/tts/{dst.name}"}
            lemma = it.get("lemma")
            if lemma and lemma in native:
                nv = native[lemma]
                entry["native"] = {k: nv[k] for k in ("src", "file", "page", "author", "license")}
                entry["native"]["word"] = lemma
            elif lemma and old.get(key, {}).get("native"):
                entry["native"] = old[key]["native"]  # keep earlier result if the API was flaky
            manifest[key] = entry
            if n % 25 == 0:
                print(f"  tts {n}/{len(items)}")

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"manifest: {len(manifest)} entries, {sum(1 for v in manifest.values() if 'native' in v)} with native audio")


if __name__ == "__main__":
    main()

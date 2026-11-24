"""
Builds the exam listening audio from scripts/de-audio/exam-texts.json.

Each clip is a list of lines spoken by "m" (Piper Thorsten, CC0 dataset) or
"f" (Piper Kerstin, CC0 dataset), joined with short pauses into one mp3.

Output: public/audio/de/exam/*.mp3 and lib/de/exam-audio.json  (id → src)

  python scripts/de-audio/exam.py --male de_DE-thorsten-high.onnx --female de_DE-kerstin-low.onnx
"""

import argparse
import hashlib
import json
import subprocess
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEXTS = Path(__file__).with_name("exam-texts.json")
OUT = ROOT / "public" / "audio" / "de" / "exam"
MANIFEST = ROOT / "lib" / "de" / "exam-audio.json"
RATE = 22050
PAUSE_S = 0.7


def synth(voice, text: str, cfg, path: Path):
    with wave.open(str(path), "wb") as wf:
        voice.synthesize_wav(text, wf, syn_config=cfg)


def to_mono_22k(src: Path, dst: Path):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-ac", "1", "-ar", str(RATE), "-sample_fmt", "s16", str(dst)], check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--male", required=True)
    ap.add_argument("--female", required=True)
    ap.add_argument("--length-scale", type=float, default=1.05)
    args = ap.parse_args()

    from piper import PiperVoice, SynthesisConfig

    voices = {"m": PiperVoice.load(args.male), "f": PiperVoice.load(args.female)}
    cfg = SynthesisConfig(length_scale=args.length_scale, noise_scale=0.6, noise_w_scale=0.8)
    clips = json.loads(TEXTS.read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    keep = set()

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        silence = b"\x00\x00" * int(RATE * PAUSE_S)
        for n, clip in enumerate(clips, 1):
            sig = json.dumps(clip["lines"], ensure_ascii=False) + f"|{args.length_scale}"
            h = hashlib.sha1(sig.encode()).hexdigest()[:10]
            dst = OUT / f"{clip['id']}-{h}.mp3"
            keep.add(dst.name)
            if not dst.exists():
                frames = b""
                for i, line in enumerate(clip["lines"]):
                    raw, norm = tmp / "raw.wav", tmp / "norm.wav"
                    synth(voices[line["who"]], line["text"], cfg, raw)
                    to_mono_22k(raw, norm)  # both voices → same format before joining
                    with wave.open(str(norm), "rb") as w:
                        frames += (silence if i else b"") + w.readframes(w.getnframes())
                joined = tmp / "clip.wav"
                with wave.open(str(joined), "wb") as w:
                    w.setnchannels(1)
                    w.setsampwidth(2)
                    w.setframerate(RATE)
                    w.writeframes(frames)
                subprocess.run(
                    ["ffmpeg", "-y", "-loglevel", "error", "-i", str(joined), "-af", "loudnorm=I=-18:TP=-1.5", "-ac", "1", "-ar", "44100", "-b:a", "64k", str(dst)],
                    check=True,
                )
            manifest[clip["id"]] = f"/audio/de/exam/{dst.name}"
            if n % 10 == 0:
                print(f"  {n}/{len(clips)}")

    for f in OUT.glob("*.mp3"):  # drop clips whose text changed
        if f.name not in keep:
            f.unlink()
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"exam audio: {len(manifest)} clips")


if __name__ == "__main__":
    main()

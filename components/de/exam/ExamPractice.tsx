'use client'
import { ExamPart } from './ExamParts'
import { recordPractice } from '@/lib/de/pruefung/store'
import type { ModuleId } from '@/lib/de/pruefung/types'

/** One exam part in practice mode: instant feedback, best score saved. */
export default function ExamPractice({ module, set, teil }: { module: ModuleId; set: string; teil: number }) {
  return <ExamPart module={module} set={set} teil={teil} mode="latihan" onDone={(r) => recordPractice(module, set, teil, r.max ? (100 * r.raw) / r.max : 0)} />
}

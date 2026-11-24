import { redirect } from 'next/navigation'

/** Klar is the main app: the root opens the language picker. The old Hafalin home lives at /hafalin. */
export default function Root() {
  redirect('/mulai')
}

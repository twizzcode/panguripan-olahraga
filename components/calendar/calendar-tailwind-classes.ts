import type { CalendarEvent } from './calendar-types'

export const colorOptions = [
  { value: 'emerald', label: 'Emerald', className: 'bg-emerald-500' },
  { value: 'amber', label: 'Amber', className: 'bg-amber-500' },
  { value: 'sky', label: 'Sky', className: 'bg-sky-500' },
  { value: 'rose', label: 'Rose', className: 'bg-rose-500' },
] as const

export const bookingStatusOptions: Array<{
  value: CalendarEvent['approvalStatus']
  label: string
}> = [
  { value: 'pending', label: 'Belum disetujui' },
  { value: 'approved', label: 'Disetujui' },
]

export function getEventStatusClasses(status: CalendarEvent['approvalStatus']) {
  if (status === 'approved') {
    return {
      dot: 'bg-emerald-500',
      card: 'bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/40',
      text: 'text-emerald-700',
      badge: 'bg-emerald-500/12 text-emerald-700 border-emerald-500/20',
    }
  }

  return {
    dot: 'bg-amber-500',
    card: 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/40',
    text: 'text-amber-700',
    badge: 'bg-amber-500/12 text-amber-700 border-amber-500/20',
  }
}

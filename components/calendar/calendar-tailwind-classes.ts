import type { CalendarEvent } from './calendar-types'

export const bookingStatusOptions: Array<{
  value: CalendarEvent['paymentStatus']
  label: string
}> = [
  { value: 'unpaid', label: 'Belum bayar' },
  { value: 'paid', label: 'Sudah bayar' },
]

export function getEventStatusClasses(status: CalendarEvent['paymentStatus']) {
  if (status === 'paid') {
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

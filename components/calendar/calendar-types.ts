export type CalendarProps = {
  events: CalendarEvent[]
  setEvents: (events: CalendarEvent[]) => void
  mode: Mode
  setMode: (mode: Mode) => void
  date: Date
  setDate: (date: Date) => void
  calendarIconIsToday?: boolean
}

export type CalendarContextType = CalendarProps & {
  manageEventDialogOpen: boolean
  setManageEventDialogOpen: (open: boolean) => void
  selectedEvent: CalendarEvent | null
  setSelectedEvent: (event: CalendarEvent | null) => void
}
export type CalendarEvent = {
  id: string
  transactionId: string
  status: 'pending' | 'booked'
  paymentStatus: 'unpaid' | 'paid'
  name: string
  institution: string
  whatsapp: string
  durationHours: number
  start: Date
  end: Date
}

export const calendarModes = ['3 days', 'week'] as const
export type Mode = (typeof calendarModes)[number]

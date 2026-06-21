'use client'

import { startOfDay } from 'date-fns'
import { useEffect, useState } from 'react'
import Calendar from './calendar/calendar'
import { CalendarEvent, Mode } from './calendar/calendar-types'

type CalendarDemoProps = {
  events: CalendarEvent[]
  setEvents: (events: CalendarEvent[]) => void
}

export default function CalendarDemo({
  events,
  setEvents,
}: CalendarDemoProps) {
  const [mode, setMode] = useState<Mode>('3 days')
  const [date, setDate] = useState<Date>(() => startOfDay(new Date()))

  useEffect(() => {
    const syncMode = () => {
      setMode(window.innerWidth >= 768 ? 'week' : '3 days')
    }

    syncMode()
    window.addEventListener('resize', syncMode)

    return () => window.removeEventListener('resize', syncMode)
  }, [])

  return (
    <Calendar
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
    />
  )
}

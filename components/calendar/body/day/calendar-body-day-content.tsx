import { isSameDay } from 'date-fns'

import { cn } from '@/lib/utils'
import { useCalendarContext } from '../../calendar-context'
import { HOUR_ROW_HEIGHT, hours } from './calendar-body-margin-day-margin'
import CalendarBodyHeader from '../calendar-body-header'
import CalendarEvent from '../../calendar-event'

export default function CalendarBodyDayContent({ date }: { date: Date }) {
  const { events } = useCalendarContext()
  const isToday = isSameDay(date, new Date())

  const dayEvents = events.filter((event) => isSameDay(event.start, date))

  return (
    <div className="flex flex-col flex-grow">
      <CalendarBodyHeader date={date} />

      <div
        className={cn(
          'relative flex-1',
          isToday ? 'bg-amber-50/55' : 'bg-background'
        )}
      >
        {hours.map((hour) => (
          <div
            key={hour}
            className="border-b border-border/50 group"
            style={{ height: `${HOUR_ROW_HEIGHT}px` }}
          />
        ))}

        {dayEvents.map((event) => (
          <CalendarEvent key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

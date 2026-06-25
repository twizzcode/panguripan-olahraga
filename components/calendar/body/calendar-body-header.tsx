import { format, isSameDay } from 'date-fns'
import { id } from 'date-fns/locale'
import { cn } from '../../../lib/utils'
import { CALENDAR_HEADER_HEIGHT } from './day/calendar-body-margin-day-margin'

export default function CalendarBodyHeader({
  date,
  onlyDay = false,
}: {
  date: Date
  onlyDay?: boolean
}) {
  const isToday = isSameDay(date, new Date())

  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex w-full items-start justify-center gap-1 border-r border-b pt-1',
        isToday ? 'bg-amber-100/55' : 'bg-background'
      )}
      style={{ height: `${CALENDAR_HEADER_HEIGHT}px` }}
    >
      <span
        className={cn(
          'text-xs font-medium',
          isToday ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {format(date, 'EEE', { locale: id })}
      </span>
      {!onlyDay && (
        <span
          className={cn(
            'text-xs font-medium',
            isToday ? 'text-primary font-bold' : 'text-foreground'
          )}
        >
          {format(date, 'dd')}
        </span>
      )}
    </div>
  )
}

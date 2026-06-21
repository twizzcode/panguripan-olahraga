import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export const hours = Array.from({ length: 24 }, (_, i) => i)
export const HOUR_ROW_HEIGHT = 40
export const CALENDAR_HEADER_HEIGHT = 26

export default function CalendarBodyMarginDayMargin({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'sticky left-0 w-12 bg-background z-10 flex flex-col',
        className
      )}
    >
      <div
        className="sticky top-0 left-0 z-20 border-r border-b bg-background"
        style={{ height: `${CALENDAR_HEADER_HEIGHT}px` }}
      />
      <div className="sticky left-0 w-12 bg-background z-10 flex flex-col">
        {hours.map((hour) => (
          <div
            key={hour}
            className="relative first:mt-0"
            style={{ height: `${HOUR_ROW_HEIGHT}px` }}
          >
            {hour !== 0 && (
              <span className="absolute text-xs text-muted-foreground -top-2.5 left-2">
                {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

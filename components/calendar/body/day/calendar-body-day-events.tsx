import { useCalendarContext } from '../../calendar-context'
import { isSameDay } from 'date-fns'
import { getEventStatusClasses } from '../../calendar-tailwind-classes'

export default function CalendarBodyDayEvents() {
  const { events, date, setManageEventDialogOpen, setSelectedEvent } =
    useCalendarContext()
  const dayEvents = events.filter((event) => isSameDay(event.start, date))

  return !!dayEvents.length ? (
    <div className="flex flex-col gap-2">
      <p className="font-medium p-2 pb-0 font-heading">Events</p>
      <div className="flex flex-col gap-2">
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className="cursor-pointer px-2"
            onClick={() => {
              setSelectedEvent(event)
              setManageEventDialogOpen(true)
            }}
          >
            <div className="flex items-start gap-2">
              <div
                className={`mt-1 size-2 rounded-full ${getEventStatusClasses(
                  event.paymentStatus
                ).dot}`}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {event.name}
                </p>
                {event.institution && (
                  <p className="truncate text-xs text-muted-foreground">
                    {event.institution}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="p-2 text-muted-foreground">No events today...</div>
  )
}

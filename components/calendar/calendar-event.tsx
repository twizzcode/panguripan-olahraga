import { CalendarEvent as CalendarEventType } from '@/components/calendar/calendar-types'
import { useCalendarContext } from '@/components/calendar/calendar-context'
import { isSameDay, isSameMonth } from 'date-fns'
import { cn } from '@/lib/utils'
import { motion, MotionConfig, AnimatePresence } from 'framer-motion'
import { HOUR_ROW_HEIGHT } from '@/components/calendar/body/day/calendar-body-margin-day-margin'
import { getEventStatusClasses } from '@/components/calendar/calendar-tailwind-classes'

interface EventPosition {
  left: string
  width: string
  top: string
  height: string
}

function getOverlappingEvents(
  currentEvent: CalendarEventType,
  events: CalendarEventType[]
): CalendarEventType[] {
  return events.filter((event) => {
    if (event.id === currentEvent.id) return false
    return (
      currentEvent.start < event.end &&
      currentEvent.end > event.start &&
      isSameDay(currentEvent.start, event.start)
    )
  })
}

function calculateEventPosition(
  event: CalendarEventType,
  allEvents: CalendarEventType[]
): EventPosition {
  const overlappingEvents = getOverlappingEvents(event, allEvents)
  const group = [event, ...overlappingEvents].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  )
  const position = group.indexOf(event)
  const width = `${100 / (overlappingEvents.length + 1)}%`
  const left = `${(position * 100) / (overlappingEvents.length + 1)}%`

  const startHour = event.start.getUTCHours()
  const startMinutes = event.start.getUTCMinutes()

  let endHour = event.end.getUTCHours()
  let endMinutes = event.end.getUTCMinutes()

  const isSameUTCDay = 
    event.start.getUTCFullYear() === event.end.getUTCFullYear() &&
    event.start.getUTCMonth() === event.end.getUTCMonth() &&
    event.start.getUTCDate() === event.end.getUTCDate()

  if (!isSameUTCDay) {
    endHour = 23
    endMinutes = 59
  }

  const topPosition =
    startHour * HOUR_ROW_HEIGHT + (startMinutes / 60) * HOUR_ROW_HEIGHT
  const duration = endHour * 60 + endMinutes - (startHour * 60 + startMinutes)
  const height = (duration / 60) * HOUR_ROW_HEIGHT

  return {
    left,
    width,
    top: `${topPosition}px`,
    height: `${height}px`,
  }
}

export default function CalendarEvent({
  event,
  month = false,
  className,
}: {
  event: CalendarEventType
  month?: boolean
  className?: string
}) {
  const { events, setSelectedEvent, setManageEventDialogOpen, date } =
    useCalendarContext()
  const style = month ? {} : calculateEventPosition(event, events)
  const statusClasses = getEventStatusClasses(event.approvalStatus)

  // Generate a unique key that includes the current month to prevent animation conflicts
  const isEventInCurrentMonth = isSameMonth(event.start, date)
  const animationKey = `${event.id}-${
    isEventInCurrentMonth ? 'current' : 'adjacent'
  }`

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          className={cn(
            'cursor-pointer rounded-md border px-3 py-1.5 transition-all duration-300',
            statusClasses.card,
            !month && 'absolute',
            className
          )}
          style={style}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedEvent(event)
            setManageEventDialogOpen(true)
          }}
          initial={{
            opacity: 0,
            y: -3,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            transition: {
              duration: 0.15,
              ease: 'easeOut',
            },
          }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
            opacity: {
              duration: 0.2,
              ease: 'linear',
            },
            layout: {
              duration: 0.2,
              ease: 'easeOut',
            },
          }}
          layoutId={`event-${animationKey}-${month ? 'month' : 'day'}`}
        >
          <motion.div
            className={cn(
              'flex h-full w-full items-center justify-center text-center',
              statusClasses.text,
              month && 'flex-row items-center justify-between'
            )}
            layout="position"
          >
            <p className={cn('truncate text-xs font-medium', month && 'text-xs')}>
              {event.institution || event.name}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  )
}

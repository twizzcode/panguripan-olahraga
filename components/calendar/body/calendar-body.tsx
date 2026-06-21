import { useCalendarContext } from '../calendar-context'
import CalendarBodyThreeDays from './three-days/calendar-body-three-days'
import CalendarBodyWeek from './week/calendar-body-week'

export default function CalendarBody() {
  const { mode } = useCalendarContext()

  return (
    <>
      {mode === '3 days' && <CalendarBodyThreeDays />}
      {mode === 'week' && <CalendarBodyWeek />}
    </>
  )
}

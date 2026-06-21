import { addDays } from 'date-fns'

import { useCalendarContext } from '../../calendar-context'
import CalendarBodyMarginDayMargin from '../day/calendar-body-margin-day-margin'
import CalendarBodyDayContent from '../day/calendar-body-day-content'

export default function CalendarBodyThreeDays() {
  const { date } = useCalendarContext()

  const days = Array.from({ length: 3 }, (_, index) => addDays(date, index))

  return (
    <div className="flex flex-grow divide-x overflow-hidden">
      <div className="flex flex-grow flex-col divide-y overflow-hidden">
        <div className="flex flex-1 overflow-y-auto">
          <div className="relative flex flex-1 divide-x">
            <CalendarBodyMarginDayMargin />
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className="min-w-0 flex-1"
              >
                <CalendarBodyDayContent date={day} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

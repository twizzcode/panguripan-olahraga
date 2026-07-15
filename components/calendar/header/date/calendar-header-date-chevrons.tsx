import { Button } from '@/components/ui/button'
import { useCalendarContext } from '../../calendar-context'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  addDays,
  addWeeks,
  subDays,
  subWeeks,
} from 'date-fns'
import { id } from 'date-fns/locale'

function formatRangeLabel(date: Date, mode: '3 days' | 'week') {
  const endDate = addDays(date, mode === 'week' ? 6 : 2)

  return `${format(date, 'd MMMM', { locale: id })}–${format(endDate, 'd MMMM, yyyy', { locale: id })}`
}

export default function CalendarHeaderDateChevrons() {
  const { mode, date, setDate } = useCalendarContext()

  function handleDateBackward() {
    switch (mode) {
      case '3 days':
        setDate(subDays(date, 3))
        break
      case 'week':
        setDate(subWeeks(date, 1))
        break
    }
  }

  function handleDateForward() {
    switch (mode) {
      case '3 days':
        setDate(addDays(date, 3))
        break
      case 'week':
        setDate(addWeeks(date, 1))
        break
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-7 w-7 p-1"
        onClick={handleDateBackward}
      >
        <ChevronLeft className="min-w-5 min-h-5" />
      </Button>

      <span className="min-w-[140px] text-center font-medium">
        {formatRangeLabel(date, mode)}
      </span>

      <Button
        variant="outline"
        className="h-7 w-7 p-1"
        onClick={handleDateForward}
      >
        <ChevronRight className="min-w-5 min-h-5" />
      </Button>
    </div>
  )
}

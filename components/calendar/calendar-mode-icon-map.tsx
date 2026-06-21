import { CalendarRange, Columns2 } from 'lucide-react'
import { Mode } from './calendar-types'

export const calendarModeIconMap: Record<Mode, React.ReactNode> = {
  '3 days': <CalendarRange />,
  week: <Columns2 />,
}

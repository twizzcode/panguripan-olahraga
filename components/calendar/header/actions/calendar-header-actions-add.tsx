'use client'

import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth-client'
import { useCalendarContext } from '../../calendar-context'

export default function CalendarHeaderActionsAdd() {
  const { date } = useCalendarContext()
  const router = useRouter()
  const session = authClient.useSession()

  function handleClick() {
    const destination = `/booking/create?date=${format(date, 'yyyy-MM-dd')}`

    if (!session.data?.user) {
      router.push(`/login?next=${encodeURIComponent(destination)}`)
      return
    }

    router.push(destination)
  }

  return (
    <Button
      className="flex items-center gap-1 bg-brand text-background"
      onClick={handleClick}
    >
      <Plus />
      Atur Jadwal
    </Button>
  )
}

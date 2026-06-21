'use client'

import { History } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export default function CalendarHeaderActionsHistory() {
  const router = useRouter()
  const session = authClient.useSession()

  function handleClick() {
    if (!session.data?.user) {
      router.push('/login?next=/riwayat-booking')
      return
    }

    router.push('/riwayat-booking')
  }

  return (
    <Button variant="outline" onClick={handleClick}>
      <History />
      Riwayat
    </Button>
  )
}

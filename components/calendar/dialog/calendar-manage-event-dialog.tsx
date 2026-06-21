import { format } from 'date-fns'
import {
  CalendarDays,
  Clock3,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getEventStatusClasses } from '../calendar-tailwind-classes'
import { useCalendarContext } from '../calendar-context'

export default function CalendarManageEventDialog() {
  const {
    manageEventDialogOpen,
    setManageEventDialogOpen,
    selectedEvent,
    setSelectedEvent,
  } = useCalendarContext()

  function handleClose() {
    setManageEventDialogOpen(false)
    setSelectedEvent(null)
  }

  return (
    <Dialog open={manageEventDialogOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[min(92vw,36rem)] max-w-none sm:max-w-none">
        {selectedEvent && (
          <div className="space-y-5">
            <DialogHeader className="pr-10">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={getEventStatusClasses(selectedEvent.paymentStatus).badge}>
                  {selectedEvent.paymentStatus === 'paid'
                    ? 'Sudah bayar'
                    : 'Belum bayar'}
                </Badge>
                <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">
                  {selectedEvent.transactionId}
                </Badge>
              </div>
              <DialogTitle className="text-xl">
                {selectedEvent.institution || selectedEvent.name}
              </DialogTitle>
              {selectedEvent.institution ? (
                <DialogDescription>{selectedEvent.name}</DialogDescription>
              ) : null}
            </DialogHeader>

            <Separator />

            <div className="grid gap-4">
              <DetailRow
                icon={CalendarDays}
                label="Tanggal"
                value={format(selectedEvent.start, 'dd MMMM yyyy')}
              />
              <DetailRow
                icon={Clock3}
                label="Jam"
                value={`${format(selectedEvent.start, 'HH:mm')} - ${format(
                  selectedEvent.end,
                  'HH:mm'
                )}`}
              />
              <DetailRow
                icon={Clock3}
                label="Durasi"
                value={`${selectedEvent.durationHours} jam`}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="size-4" />
        <p>{label}</p>
      </div>
      <div className="pl-6 text-base font-medium text-foreground">{value}</div>
    </div>
  )
}

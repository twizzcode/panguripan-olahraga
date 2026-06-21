import { BookingPage } from "@/components/booking-page"
import { getBookings, serializeBookingEvent } from "@/lib/bookings"

export const dynamic = "force-dynamic"

export default async function BookingPageRoute() {
  const bookings = await getBookings()

  return (
    <BookingPage
      initialEvents={bookings.map(serializeBookingEvent)}
    />
  )
}

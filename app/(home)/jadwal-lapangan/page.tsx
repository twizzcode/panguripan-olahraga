import { Metadata } from "next"
import { BookingPage } from "@/components/booking-page"
import { getBookings, serializeBookingEvent } from "@/lib/bookings"

export const metadata: Metadata = {
  title: "Booking Lapangan",
  description: "Reservasi dan jadwal booking lapangan sepak bola Panguripan Olahraga.",
}

export const dynamic = "force-dynamic"

export default async function BookingPageRoute() {
  const bookings = await getBookings()

  return (
    <BookingPage
      initialEvents={bookings.map(serializeBookingEvent)}
    />
  )
}

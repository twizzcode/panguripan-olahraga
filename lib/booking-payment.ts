import { format } from "date-fns";

import type { bookings } from "@/db/schema";
import { formatBookingPrice, calculateBookingPrice } from "@/lib/booking-pricing";

export const qrisImageSrc = "/qris-placeholder.svg";

export function applyWhatsappTemplate(
  template: string,
  booking: typeof bookings.$inferSelect,
  bookingHourlyRate: number
) {
  const replacements: Record<string, string> = {
    id: booking.transactionId,
    name: booking.name,
    institution: booking.institution,
    whatsapp: booking.whatsapp,
    date: format(booking.startsAt, "dd MMMM yyyy"),
    start_time: format(booking.startsAt, "HH:mm"),
    duration_hours: String(booking.durationHours),
    amount: formatBookingPrice(
      calculateBookingPrice(booking.durationHours, bookingHourlyRate)
    ),
  };

  return template.replace(/\{([a-z_]+)\}/g, (_, key: string) => {
    return replacements[key] ?? `{${key}}`;
  });
}

export function buildBookingPaymentWhatsappLink({
  adminWhatsappNumber,
  bookingHourlyRate,
  template,
  booking,
}: {
  adminWhatsappNumber: string;
  bookingHourlyRate: number;
  template: string;
  booking: typeof bookings.$inferSelect;
}) {
  const message = applyWhatsappTemplate(
    template,
    booking,
    bookingHourlyRate
  );

  return `https://wa.me/${adminWhatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

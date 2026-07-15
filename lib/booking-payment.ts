import { format } from "date-fns";
import { id } from "date-fns/locale";

import type { bookings } from "@/db/schema";

export const qrisImageSrc = "/qris-placeholder.svg";

export function formatBookingTime(date: Date) {
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function applyWhatsappTemplate(
  template: string,
  booking: typeof bookings.$inferSelect
) {
  const replacements: Record<string, string> = {
    id: booking.transactionId,
    name: booking.name,
    institution: booking.institution,
    whatsapp: booking.whatsapp,
    date: format(booking.startsAt, "dd MMMM yyyy", { locale: id }),
    start_time: formatBookingTime(booking.startsAt),
    duration_hours: String(booking.durationHours),
  };

  return template.replace(/\{([a-z_]+)\}/g, (_, key: string) => {
    return replacements[key] ?? `{${key}}`;
  });
}

export function buildBookingPaymentWhatsappLink({
  adminWhatsappNumber,
  template,
  booking,
}: {
  adminWhatsappNumber: string;
  template: string;
  booking: typeof bookings.$inferSelect;
}) {
  const message = applyWhatsappTemplate(
    template,
    booking
  );

  return `https://wa.me/${adminWhatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

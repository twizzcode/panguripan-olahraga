import { format } from "date-fns";
import { id } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import type { bookings } from "@/db/schema";
import {
  buildBookingPaymentWhatsappLink,
  formatBookingTime,
  qrisImageSrc,
} from "@/lib/booking-payment";

export function BookingPaymentPanel({
  booking,
  adminWhatsappNumber,
  whatsappTemplate,
}: {
  booking: typeof bookings.$inferSelect;
  adminWhatsappNumber: string;
  whatsappTemplate: string;
}) {
  const whatsappLink = buildBookingPaymentWhatsappLink({
    adminWhatsappNumber,
    template: whatsappTemplate,
    booking,
  });
  const isApproved = booking.approvalStatus === "approved";

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="grid gap-8">
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem label="ID Penggunaan" value={booking.transactionId} />
            <InfoItem
              label="Tanggal"
              value={format(booking.startsAt, "dd MMMM yyyy", { locale: id })}
            />
            <InfoItem
              label="Jam Pengajuan"
              value={`${formatBookingTime(booking.startsAt)} - ${formatBookingTime(
                booking.endsAt
              )}`}
            />
            <InfoItem
              label="Durasi"
              value={`${booking.durationHours} jam`}
            />
          </div>

          {!isApproved ? (
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="bg-brand">
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  Hubungi admin
                </a>
              </Button>
            </div>
          ) : null}
        </div>

      </div>
    </section>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}

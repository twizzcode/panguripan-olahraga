import Image from "next/image";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import type { bookings } from "@/db/schema";
import {
  buildBookingPaymentWhatsappLink,
  qrisImageSrc,
} from "@/lib/booking-payment";
import {
  calculateBookingPrice,
  formatBookingPrice,
} from "@/lib/booking-pricing";

export function BookingPaymentPanel({
  booking,
  adminWhatsappNumber,
  bookingHourlyRate,
  whatsappTemplate,
}: {
  booking: typeof bookings.$inferSelect;
  adminWhatsappNumber: string;
  bookingHourlyRate: number;
  whatsappTemplate: string;
}) {
  const totalPrice = calculateBookingPrice(
    booking.durationHours,
    bookingHourlyRate
  );
  const whatsappLink = buildBookingPaymentWhatsappLink({
    adminWhatsappNumber,
    bookingHourlyRate,
    template: whatsappTemplate,
    booking,
  });
  const isPaid = booking.paymentStatus === "paid";

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              {isPaid ? "Pembayaran sudah dikonfirmasi" : "Lanjutkan pembayaran"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isPaid
                ? "Pembayaran booking ini sudah tercatat. Simpan ID transaksi untuk referensi."
                : "Scan QRIS lalu konfirmasi pembayaran ke admin setelah transfer selesai."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem label="ID transaksi" value={booking.transactionId} />
            <InfoItem label="Jumlah bayar" value={formatBookingPrice(totalPrice)} />
            <InfoItem
              label="Tanggal"
              value={format(booking.startsAt, "dd MMMM yyyy")}
            />
            <InfoItem
              label="Jam booking"
              value={`${format(booking.startsAt, "HH:mm")} - ${format(
                booking.endsAt,
                "HH:mm"
              )}`}
            />
          </div>

          {!isPaid ? (
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  Konfirmasi ke admin
                </a>
              </Button>
            </div>
          ) : null}
        </div>

        <div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <Image
              src={qrisImageSrc}
              alt="QRIS pembayaran booking"
              width={600}
              height={600}
              className="h-auto w-full"
            />
          </div>
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

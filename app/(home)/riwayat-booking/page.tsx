import { format } from "date-fns";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IconFileInvoice } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSession } from "@/lib/auth";
import { getAppSettings } from "@/lib/app-settings";
import { getRecentBookingsByUserId } from "@/lib/bookings";
import {
  calculateBookingPrice,
  formatBookingPrice,
} from "@/lib/booking-pricing";

export const dynamic = "force-dynamic";

export default async function BookingHistoryPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?next=/riwayat-booking");
  }

  const settings = await getAppSettings();
  const bookings = await getRecentBookingsByUserId(session.user.id, 10);

  return (
    <div className="w-full py-8 sm:py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Riwayat booking
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Menampilkan 10 booking terbaru yang pernah kamu buat.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Transaksi</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Instansi</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jam</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length ? (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.transactionId}
                  </TableCell>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell>{booking.institution}</TableCell>
                  <TableCell>
                    {format(booking.startsAt, "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(booking.startsAt, "HH:mm")} -{" "}
                    {format(booking.endsAt, "HH:mm")}
                  </TableCell>
                  <TableCell>{booking.durationHours} jam</TableCell>
                  <TableCell>
                    {formatBookingPrice(
                      calculateBookingPrice(
                        booking.durationHours,
                        settings.bookingHourlyRate
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.paymentStatus === "paid"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        booking.paymentStatus === "paid"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50"
                      }
                    >
                      {booking.paymentStatus === "paid"
                        ? "Sudah bayar"
                        : "Belum bayar"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon-sm" variant="outline" asChild>
                      <Link
                        href={`/booking/${booking.transactionId}`}
                        aria-label="Lihat pembayaran booking"
                      >
                        <IconFileInvoice className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-10 text-center text-muted-foreground"
                >
                  Belum ada riwayat booking.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

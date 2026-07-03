import { Metadata } from "next";
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
import { getRecentBookingsByUserId } from "@/lib/bookings";
import { formatBookingTime } from "@/lib/booking-payment";

export const metadata: Metadata = {
  title: "Riwayat Booking",
  description: "Lihat riwayat booking lapangan sepak bola Anda di Panguripan Olahraga.",
}

export const dynamic = "force-dynamic";

export default async function BookingHistoryPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?next=/riwayat-booking");
  }

  const bookings = await getRecentBookingsByUserId(session.user.id, 10);

  return (
    <div className="w-full py-8 sm:py-10">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Riwayat Pengajuan
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Menampilkan 10 pengajuan terbaru yang pernah kamu buat.
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
                    {formatBookingTime(booking.startsAt)} -{" "}
                    {formatBookingTime(booking.endsAt)}
                  </TableCell>
                  <TableCell>{booking.durationHours} jam</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.approvalStatus === "approved"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        booking.approvalStatus === "approved"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50"
                      }
                    >
                      {booking.approvalStatus === "approved"
                        ? "Disetujui"
                        : "Belum disetujui"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon-sm" variant="outline" asChild>
                      <Link
                        href={`/jadwal-lapangan/${booking.transactionId}`}
                        aria-label="Lihat pembayaran pengajuan"
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
                  colSpan={8}
                  className="py-10 text-center text-muted-foreground"
                >
                  Belum ada riwayat pengajuan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import Link from "next/link";
import { format, subDays, startOfMonth, addMonths } from "date-fns";
import { id as indonesianLocale } from "date-fns/locale";
import { asc, count, eq, gte } from "drizzle-orm";
import {
  IconArrowRight,
  IconCalendarStats,
  IconCash,
  IconClockHour4,
  IconUsers,
} from "@tabler/icons-react";

import { DashboardBookingsChart } from "@/app/(admin)/admin/dashboard-bookings-chart";
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
import { db } from "@/db";
import { bookings, users } from "@/db/schema";
import { getAppSettings } from "@/lib/app-settings";
import {
  calculateBookingPrice,
  formatBookingPrice,
} from "@/lib/booking-pricing";

export const dynamic = "force-dynamic";

const numberFormatter = new Intl.NumberFormat("id-ID");

function formatCount(value: number) {
  return numberFormatter.format(value);
}

type MonthlyBookingChartPoint = {
  month: string;
  total: number;
};

export default async function AdminPage() {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const chartRangeStart = startOfMonth(addMonths(now, -11));
  const settings = await getAppSettings();

  const [
    [{ totalUsers }],
    paidBookings,
    recentBookings,
    upcomingBookings,
    monthlyBookings,
  ] = await Promise.all([
    db
      .select({
        totalUsers: count(),
      })
      .from(users),
    db
      .select({
        id: bookings.id,
        durationHours: bookings.durationHours,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .where(eq(bookings.paymentStatus, "paid")),
    db
      .select({
        id: bookings.id,
        durationHours: bookings.durationHours,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .where(gte(bookings.createdAt, thirtyDaysAgo)),
    db
      .select({
        id: bookings.id,
        transactionId: bookings.transactionId,
        name: bookings.name,
        institution: bookings.institution,
        startsAt: bookings.startsAt,
        endsAt: bookings.endsAt,
        durationHours: bookings.durationHours,
        paymentStatus: bookings.paymentStatus,
      })
      .from(bookings)
      .where(gte(bookings.startsAt, now))
      .orderBy(asc(bookings.startsAt))
      .limit(10),
    db
      .select({
        id: bookings.id,
        startsAt: bookings.startsAt,
      })
      .from(bookings)
      .where(gte(bookings.startsAt, chartRangeStart))
      .orderBy(asc(bookings.startsAt)),
  ]);

  const totalRevenue = paidBookings.reduce(
    (sum, booking) =>
      sum + calculateBookingPrice(booking.durationHours, settings.bookingHourlyRate),
    0
  );

  const recentBookingsCount = recentBookings.length;
  const recentRevenue = paidBookings
    .filter((booking) => booking.createdAt >= thirtyDaysAgo)
    .reduce(
      (sum, booking) =>
        sum +
        calculateBookingPrice(booking.durationHours, settings.bookingHourlyRate),
      0
    );

  const chartData = buildMonthlyBookingChartData(monthlyBookings, chartRangeStart);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "User aktif",
            value: formatCount(totalUsers),
            description: "Total semua akun yang sudah terdaftar, termasuk admin.",
            icon: IconUsers,
          },
          {
            label: "Pendapatan semua",
            value: formatBookingPrice(totalRevenue),
            description: "Akumulasi booking yang status pembayarannya sudah paid.",
            icon: IconCash,
          },
          {
            label: "Booking 30 hari terakhir",
            value: formatCount(recentBookingsCount),
            description: "Jumlah booking yang dibuat dalam 30 hari terakhir.",
            icon: IconCalendarStats,
          },
          {
            label: "Pendapatan 30 hari terakhir",
            value: formatBookingPrice(recentRevenue),
            description: "Pendapatan dari booking paid dalam 30 hari terakhir.",
            icon: IconClockHour4,
          },
        ].map((item) => (
          <section
            key={item.label}
            className="rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-3xl font-semibold tracking-tight">
                  {item.value}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-2.5">
                <item.icon className="size-5 text-muted-foreground" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </section>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                Total pengunjung booking 12 bulan terakhir
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Jumlah booking per bulan berdasarkan jadwal acara yang sudah
                tercatat.
              </p>
            </div>
            <Badge variant="outline">12 bulan</Badge>
          </div>

          <div className="mt-6">
            <DashboardBookingsChart data={chartData} />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">30 hari terakhir</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Ringkasan aktivitas terbaru dari booking yang baru masuk.
              </p>
            </div>
            <Badge variant="outline">{formatCount(recentBookingsCount)} booking</Badge>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Booking baru</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatCount(recentBookingsCount)}
              </p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Pendapatan masuk</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatBookingPrice(recentRevenue)}
              </p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-sm text-muted-foreground">Rata-rata per booking</p>
              <p className="mt-2 text-2xl font-semibold">
                {recentBookingsCount
                  ? formatBookingPrice(Math.round(recentRevenue / recentBookingsCount))
                  : formatBookingPrice(0)}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Riwayat booking terdekat</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Menampilkan 10 booking berikutnya yang akan terlaksana.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/booking">
              Lihat semua booking
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Instansi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingBookings.length ? (
                upcomingBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.transactionId}
                    </TableCell>
                    <TableCell>{booking.name}</TableCell>
                    <TableCell>{booking.institution}</TableCell>
                    <TableCell>
                      {format(booking.startsAt, "dd MMM yyyy", {
                        locale: indonesianLocale,
                      })}
                    </TableCell>
                    <TableCell>
                      {format(booking.startsAt, "HH:mm")} -{" "}
                      {format(booking.endsAt, "HH:mm")}
                    </TableCell>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Belum ada booking mendatang.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

function buildMonthlyBookingChartData(
  monthlyBookings: Array<{ id: string; startsAt: Date }>,
  rangeStart: Date
) {
  const monthMap = new Map<string, MonthlyBookingChartPoint>();

  for (let index = 0; index < 12; index += 1) {
    const currentMonth = addMonths(rangeStart, index);
    const key = format(currentMonth, "yyyy-MM");

    monthMap.set(key, {
      month: format(currentMonth, "MMM", { locale: indonesianLocale }),
      total: 0,
    });
  }

  for (const booking of monthlyBookings) {
    const key = format(booking.startsAt, "yyyy-MM");
    const month = monthMap.get(key);

    if (month) {
      month.total += 1;
    }
  }

  return Array.from(monthMap.values());
}

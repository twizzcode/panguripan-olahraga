import Link from "next/link";
import { format, subDays, startOfMonth, addMonths } from "date-fns";
import { id as indonesianLocale } from "date-fns/locale";
import { asc, count, eq, gte } from "drizzle-orm";
import {
  IconArrowRight,
  IconCalendarStats,
  IconClockHour4,
  IconUsers,
  IconClock,
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
import { formatBookingTime } from "@/lib/booking-payment";

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

  const [
    [{ totalUsers }],
    approvedBookings,
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
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .where(eq(bookings.approvalStatus, "approved")),
    db
      .select({
        id: bookings.id,
        createdAt: bookings.createdAt,
        durationHours: bookings.durationHours,
        approvalStatus: bookings.approvalStatus,
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
        approvalStatus: bookings.approvalStatus,
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

  const totalApprovedBookings = approvedBookings.length;
  const recentBookingsCount = recentBookings.length;
  const recentApprovedBookings = approvedBookings.filter((booking) => booking.createdAt >= thirtyDaysAgo).length;
  const totalRecentHours = recentBookings
    .filter((booking) => booking.approvalStatus === "approved")
    .reduce((sum, booking) => sum + (booking.durationHours || 0), 0);

  const chartData = buildMonthlyBookingChartData(monthlyBookings, chartRangeStart);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Pengguna aktif",
            value: formatCount(totalUsers),
            description: "Total semua akun yang sudah terdaftar, termasuk admin.",
            icon: IconUsers,
          },
          {
            label: "Pengajuan disetujui",
            value: formatCount(totalApprovedBookings),
            description: "Total pengajuan yang sudah disetujui admin.",
            icon: IconCalendarStats,
          },
          {
            label: "Pengajuan 30 hari terakhir",
            value: formatCount(recentBookingsCount),
            description: "Jumlah pengajuan yang dibuat dalam 30 hari terakhir.",
            icon: IconClockHour4,
          },
          {
            label: "Total jam 30 hari terakhir",
            value: formatCount(totalRecentHours),
            description: "Total durasi jam dari pengajuan yang disetujui dalam 30 hari terakhir.",
            icon: IconClock,
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

      <div className="grid gap-6">
        <section className="min-w-0 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-1">
              <h2 className="text-lg font-semibold">
                Total pengunjung 12 bulan terakhir
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Jumlah jadwal per bulan berdasarkan jadwal acara yang sudah
                tercatat.
              </p>
            </div>
            <Badge variant="outline" className="w-fit">12 bulan</Badge>
          </div>
 
          <div className="mt-6 min-w-0 overflow-hidden">
            <DashboardBookingsChart data={chartData} />
          </div>
        </section>
      </div>

      <section className="min-w-0 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 min-w-0">
            <h2 className="text-lg font-semibold">Riwayat pengajuan terdekat</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Menampilkan 10 pengajuan berikutnya yang akan terlaksana.
            </p>
          </div>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/admin/jadwal-lapangan">
              Lihat semua pengajuan
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
 
        <div className="mt-6 min-w-0 overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Instansi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead>Durasi</TableHead>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Belum ada pengajuan mendatang.
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

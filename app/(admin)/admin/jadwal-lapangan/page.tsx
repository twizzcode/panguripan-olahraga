import { Fragment } from "react";
import Link from "next/link";
import { endOfDay, format, parseISO, startOfDay } from "date-fns";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  ilike,
  lte,
  gte,
  or,
} from "drizzle-orm";
import { IconCoin, IconTrash } from "@tabler/icons-react";

import {
  approveBooking,
  deleteBooking,
} from "@/app/(admin)/admin/jadwal-lapangan/actions";
import { BookingFilters } from "@/app/(admin)/admin/jadwal-lapangan/booking-filters";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;
const BOOKING_TABS = ["all", "pending", "upcoming", "history"] as const;

type BookingTab = (typeof BOOKING_TABS)[number];

function getBookingTab(value: string | undefined): BookingTab {
  if (value && BOOKING_TABS.includes(value as BookingTab)) {
    return value as BookingTab;
  }

  return "pending";
}

function getPage(value: string | undefined) {
  const page = Number(value ?? "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function buildBookingHref({
  tab,
  q,
  date,
  page,
}: {
  tab: BookingTab;
  q: string;
  date: string;
  page?: number;
}) {
  const params = new URLSearchParams();

  if (tab !== "pending") {
    params.set("tab", tab);
  }

  if (q) {
    params.set("q", q);
  }

  if (date) {
    params.set("date", date);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/admin/jadwal-lapangan?${query}` : "/admin/jadwal-lapangan";
}

function getTabWhereClause(tab: BookingTab, now: Date) {
  switch (tab) {
    case "all":
      return undefined;
    case "upcoming":
      return and(eq(bookings.approvalStatus, "approved"), gt(bookings.startsAt, now));
    case "history":
      return and(eq(bookings.approvalStatus, "approved"), lte(bookings.startsAt, now));
    case "pending":
    default:
      return eq(bookings.approvalStatus, "pending");
  }
}

export default async function AdminBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; page?: string; date?: string }>;
}) {
  const now = new Date();
  const params = await searchParams;
  const tab = getBookingTab(params.tab);
  const query = (params.q ?? "").trim();
  const date = (params.date ?? "").trim();
  const page = getPage(params.page);
  const offset = (page - 1) * PAGE_SIZE;
  const searchFilter = query
    ? or(
        ilike(bookings.transactionId, `%${query}%`),
        ilike(bookings.name, `%${query}%`),
        ilike(bookings.institution, `%${query}%`),
        ilike(bookings.whatsapp, `%${query}%`)
      )
    : undefined;
  const dateFilter = date
    ? (() => {
        const parsedDate = parseISO(date);

        if (Number.isNaN(parsedDate.getTime())) {
          return undefined;
        }

        return and(
          gte(bookings.startsAt, startOfDay(parsedDate)),
          lte(bookings.startsAt, endOfDay(parsedDate))
        );
      })()
    : undefined;

  const pendingWhere = getTabWhereClause("pending", now);
  const upcomingWhere = getTabWhereClause("upcoming", now);
  const historyWhere = getTabWhereClause("history", now);
  const activeWhere = getTabWhereClause(tab, now);
  const filteredWhere = and(activeWhere, searchFilter, dateFilter);

  const [
    [{ allCount }],
    [{ pendingCount }],
    [{ upcomingCount }],
    [{ historyCount }],
    [{ totalCount }],
    bookingRequests,
  ] = await Promise.all([
    db.select({ allCount: count() }).from(bookings),
    db.select({ pendingCount: count() }).from(bookings).where(pendingWhere),
    db.select({ upcomingCount: count() }).from(bookings).where(upcomingWhere),
    db.select({ historyCount: count() }).from(bookings).where(historyWhere),
    db.select({ totalCount: count() }).from(bookings).where(filteredWhere),
    db
      .select()
      .from(bookings)
      .where(filteredWhere)
      .orderBy(
        tab === "history" ? desc(bookings.startsAt) : asc(bookings.startsAt)
      )
      .limit(PAGE_SIZE)
      .offset(offset),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  return (
    <div className="min-w-0 space-y-6">
      <section className="min-w-0 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Kelola Jadwal</h2>
            <p className="text-sm text-muted-foreground">
              Pisahkan jadwal yang belum disetujui, jadwal yang akan datang,
              dan riwayat jadwal yang sudah lewat.
            </p>
          </div>

          <BookingFilters tab={tab} query={query} date={date} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { key: "all", label: "Semua", count: allCount },
            { key: "pending", label: "Belum disetujui", count: pendingCount },
            { key: "upcoming", label: "Akan datang", count: upcomingCount },
            { key: "history", label: "Riwayat", count: historyCount },
          ].map((item) => {
            const isActive = tab === item.key;

            return (
              <Link
                key={item.key}
                href={buildBookingHref({
                  tab: item.key as BookingTab,
                  q: query,
                  date,
                })}
                className={cn(
                  buttonVariants({
                    variant: isActive ? "default" : "outline",
                    size: "sm",
                  })
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "ml-1 rounded-md border px-1.5 py-0.5 text-xs",
                    isActive
                      ? "border-primary-foreground/30 text-primary-foreground"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {item.count}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-border">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Instansi</TableHead>
                <TableHead>Nomor WhatsApp</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookingRequests.length ? (
                bookingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.transactionId}
                    </TableCell>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.institution}</TableCell>
                    <TableCell>{request.whatsapp}</TableCell>
                    <TableCell>{format(request.startsAt, "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      {format(request.startsAt, "HH:mm")} -{" "}
                      {format(request.endsAt, "HH:mm")}
                    </TableCell>
                    <TableCell>{request.durationHours} jam</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.approvalStatus === "approved"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          request.approvalStatus === "approved"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50"
                        }
                      >
                        {request.approvalStatus === "approved"
                          ? "Disetujui"
                          : "Belum disetujui"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {request.approvalStatus !== "approved" ? (
                          <form action={approveBooking}>
                            <input type="hidden" name="id" value={request.id} />
                            <Button size="sm" variant="brand">
                              <IconCoin className="size-4" />
                              Setujui
                            </Button>
                          </form>
                        ) : null}
                        <form action={deleteBooking}>
                          <input type="hidden" name="id" value={request.id} />
                          <Button
                            size="icon-sm"
                            variant="destructive"
                            aria-label="Hapus booking"
                          >
                            <IconTrash className="size-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-10 text-center text-muted-foreground"
                  >
                    {query
                      ? "Tidak ada booking yang cocok dengan pencarian ini."
                      : "Belum ada booking pada kategori ini."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Menampilkan {bookingRequests.length} dari {totalCount} booking.
          </p>

          {totalPages > 1 ? (
            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={buildBookingHref({
                      tab,
                      q: query,
                      date,
                      page: Math.max(1, safePage - 1),
                    })}
                    text="Prev"
                    aria-disabled={safePage <= 1}
                    className={safePage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter((itemPage) => {
                    return (
                      itemPage === 1 ||
                      itemPage === totalPages ||
                      Math.abs(itemPage - safePage) <= 1
                    );
                  })
                  .map((itemPage, index, pages) => {
                    const previousPage = pages[index - 1];
                    const shouldShowEllipsis =
                      previousPage && itemPage - previousPage > 1;

                    return (
                      <Fragment key={itemPage}>
                        {shouldShowEllipsis ? (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : null}
                        <PaginationItem>
                          <PaginationLink
                            href={buildBookingHref({
                              tab,
                              q: query,
                              date,
                              page: itemPage,
                            })}
                            isActive={itemPage === safePage}
                          >
                            {itemPage}
                          </PaginationLink>
                        </PaginationItem>
                      </Fragment>
                    );
                  })}

                <PaginationItem>
                  <PaginationNext
                    href={buildBookingHref({
                      tab,
                      q: query,
                      date,
                      page: Math.min(totalPages, safePage + 1),
                    })}
                    text="Next"
                    aria-disabled={safePage >= totalPages}
                    className={
                      safePage >= totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
      </section>
    </div>
  );
}

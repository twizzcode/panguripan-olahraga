import { and, asc, desc, eq, gt, gte, lt } from "drizzle-orm";
import { addDays, startOfDay } from "date-fns";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import {
  serializeBookingEvent as serializeBookingEventRecord,
  type SerializedCalendarEvent,
} from "@/lib/booking-events";
import { createBookingTransactionId } from "@/lib/booking-transaction";

export async function getBookings() {
  return db.select().from(bookings).orderBy(asc(bookings.startsAt));
}

export async function getBookingsByUserId(userId: string) {
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.startsAt));
}

export async function getRecentBookingsByUserId(userId: string, limit = 10) {
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.startsAt))
    .limit(limit);
}

export async function getBookingByUserIdAndTransactionId(
  userId: string,
  transactionId: string
) {
  const [booking] = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.userId, userId),
        eq(bookings.transactionId, transactionId)
      )
    )
    .limit(1);

  return booking ?? null;
}

export async function hasBookingConflict(start: Date, end: Date) {
  const [existingBooking] = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(and(lt(bookings.startsAt, end), gt(bookings.endsAt, start)))
    .limit(1);

  return Boolean(existingBooking);
}

export async function getNextBookingTransactionId(date: Date) {
  const dayStart = startOfDay(date);
  const nextDay = addDays(dayStart, 1);

  const [latestBooking] = await db
    .select({ transactionId: bookings.transactionId })
    .from(bookings)
    .where(
      and(gte(bookings.startsAt, dayStart), lt(bookings.startsAt, nextDay))
    )
    .orderBy(desc(bookings.transactionId))
    .limit(1);

  const latestSequence = latestBooking?.transactionId
    ? Number(latestBooking.transactionId.split("-").pop() ?? "0")
    : 0;

  return createBookingTransactionId(date, latestSequence + 1);
}

export function serializeBookingEvent(
  booking: typeof bookings.$inferSelect
): SerializedCalendarEvent {
  return serializeBookingEventRecord(booking);
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import { getSession } from "@/lib/auth";
import type { SerializedCalendarEvent } from "@/lib/booking-events";
import {
  getNextBookingTransactionId,
  hasBookingConflict,
  serializeBookingEvent,
} from "@/lib/bookings";

const createBookingSchema = z.object({
  name: z.string().trim().min(1),
  institution: z.string().trim().min(1),
  whatsapp: z.string().trim().min(1),
  start: z.string().datetime(),
  durationHours: z.number().int().min(1).max(8),
});

type CreateBookingResult =
  | {
      ok: true;
      booking: SerializedCalendarEvent;
    }
  | {
      ok: false;
      reason: "conflict" | "unauthorized" | "invalid";
    };

export async function createBooking(
  input: z.infer<typeof createBookingSchema>
): Promise<CreateBookingResult> {
  const session = await getSession();

  if (!session?.user) {
    return { ok: false, reason: "unauthorized" };
  }

  const parsed = createBookingSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, reason: "invalid" };
  }

  const start = new Date(parsed.data.start);

  if (Number.isNaN(start.getTime())) {
    return { ok: false, reason: "invalid" };
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  if (start < startOfToday) {
    return { ok: false, reason: "invalid" };
  }

  const end = new Date(start);
  end.setHours(end.getHours() + parsed.data.durationHours);

  if (await hasBookingConflict(start, end)) {
    return { ok: false, reason: "conflict" };
  }

  const now = new Date();
  const transactionId = await getNextBookingTransactionId(start);
  const booking = {
    id: crypto.randomUUID(),
    transactionId,
    userId: session.user.id,
    status: "pending" as const,
    approvalStatus: "pending" as const,
    name: parsed.data.name,
    institution: parsed.data.institution,
    whatsapp: parsed.data.whatsapp,
    durationHours: parsed.data.durationHours,
    startsAt: start,
    endsAt: end,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(bookings).values(booking);

  revalidatePath("/jadwal-lapangan");

  return {
    ok: true,
    booking: serializeBookingEvent(booking),
  };
}

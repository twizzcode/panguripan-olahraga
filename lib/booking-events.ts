import type { CalendarEvent } from "@/components/calendar/calendar-types";
import type { bookings } from "@/db/schema";

export type SerializedCalendarEvent = Omit<CalendarEvent, "start" | "end"> & {
  start: string;
  end: string;
};

export function serializeBookingEvent(
  booking: typeof bookings.$inferSelect
): SerializedCalendarEvent {
  return {
    id: booking.id,
    transactionId: booking.transactionId,
    status: booking.status as CalendarEvent["status"],
    approvalStatus: booking.approvalStatus as CalendarEvent["approvalStatus"],
    name: booking.name,
    institution: booking.institution,
    whatsapp: booking.whatsapp,
    durationHours: booking.durationHours,
    start: booking.startsAt.toISOString(),
    end: booking.endsAt.toISOString(),
  };
}

export function parseSerializedCalendarEvent(
  event: SerializedCalendarEvent
): CalendarEvent {
  return {
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  };
}

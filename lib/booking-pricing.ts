import { DEFAULT_BOOKING_HOURLY_RATE } from "@/lib/app-settings";

export function calculateBookingPrice(
  durationHours: number,
  hourlyRate = DEFAULT_BOOKING_HOURLY_RATE
) {
  return durationHours * hourlyRate;
}

export function formatBookingPrice(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

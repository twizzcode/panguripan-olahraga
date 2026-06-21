import { redirect } from "next/navigation";

import { BookingCreatePage } from "@/components/booking-create-page";
import { getAppSettings } from "@/lib/app-settings";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function BookingCreateRoute() {
  const session = await getSession();
  const settings = await getAppSettings();

  if (!session?.user) {
    redirect("/login?next=/booking/create");
  }

  return <BookingCreatePage bookingHourlyRate={settings.bookingHourlyRate} />;
}

import { redirect } from "next/navigation";

import { BookingCreatePage } from "@/components/booking-create-page";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function BookingCreateRoute() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?next=/jadwal-lapangan/create");
  }

  return <BookingCreatePage />;
}

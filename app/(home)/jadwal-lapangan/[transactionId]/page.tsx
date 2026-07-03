import { notFound, redirect } from "next/navigation";

import { BookingPaymentPanel } from "@/components/booking-payment-panel";
import { Badge } from "@/components/ui/badge";
import { getAppSettings } from "@/lib/app-settings";
import { getSession } from "@/lib/auth";
import { getBookingByUserIdAndTransactionId } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export default async function BookingPaymentPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?next=/jadwal-lapangan");
  }

  const { transactionId } = await params;
  const settings = await getAppSettings();
  const booking = await getBookingByUserIdAndTransactionId(
    session.user.id,
    transactionId
  );

  if (!booking) {
    notFound();
  }

  return (
    <div className="w-full py-8 sm:py-10">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant={booking.approvalStatus === "approved" ? "secondary" : "outline"}
            className={
              booking.approvalStatus === "approved"
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-50"
            }
          >
            {booking.approvalStatus === "approved" ? "Sudah disetujui" : "Belum disetujui"}
          </Badge>
          <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">
            {booking.transactionId}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Pengajuan Persetujuan
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {booking.approvalStatus === "approved"
            ? "Jadwal ini sudah disetujui admin."
            : "Jadwal ini belum disetujui. Hubungi admin untuk konfirmasi."}
        </p>
      </div>

      <div className="mt-6">
        <BookingPaymentPanel
          booking={booking}
          adminWhatsappNumber={settings.adminWhatsappNumber}
          whatsappTemplate={settings.whatsappConfirmationTemplate}
        />
      </div>
    </div>
  );
}

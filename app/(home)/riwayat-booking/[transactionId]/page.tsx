import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BookingPaymentHistoryPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await params;

  redirect(`/jadwal-lapangan/${transactionId}`);
}

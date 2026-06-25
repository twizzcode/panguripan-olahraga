"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { bookings } from "@/db/schema";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

function revalidateBookingPages() {
  revalidatePath("/admin/booking");
  revalidatePath("/booking");
  revalidatePath("/riwayat-booking");
}

export async function approveBooking(formData: FormData) {
  await requireAdmin();

  const id = z.string().trim().min(1).parse(formData.get("id"));

  await db
    .update(bookings)
    .set({
      approvalStatus: "approved",
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id));

  revalidateBookingPages();
}

export async function deleteBooking(formData: FormData) {
  await requireAdmin();

  const id = z.string().trim().min(1).parse(formData.get("id"));

  await db.delete(bookings).where(eq(bookings.id, id));

  revalidateBookingPages();
}

"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { appSettings, users } from "@/db/schema";
import { DEFAULT_SETTINGS_ID, getAppSettings } from "@/lib/app-settings";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return session;
}

function revalidateSettingsPages() {
  revalidatePath("/admin/pengaturan");
  revalidatePath("/booking");
  revalidatePath("/riwayat-booking");
}

const settingsSchema = z.object({
  adminWhatsappNumber: z.string().trim().min(8),
  whatsappConfirmationTemplate: z.string().trim().min(1),
});

export async function updateAppSettings(formData: FormData) {
  await requireAdmin();

  const values = settingsSchema.parse({
    adminWhatsappNumber: formData.get("adminWhatsappNumber"),
    whatsappConfirmationTemplate: formData.get("whatsappConfirmationTemplate"),
  });

  await getAppSettings();

  await db
    .update(appSettings)
    .set({
      adminWhatsappNumber: values.adminWhatsappNumber,
      whatsappConfirmationTemplate: values.whatsappConfirmationTemplate,
      updatedAt: new Date(),
    })
    .where(eq(appSettings.id, DEFAULT_SETTINGS_ID));

  revalidateSettingsPages();
}

export async function promoteUserToAdmin(formData: FormData) {
  await requireAdmin();

  const userId = z.string().trim().min(1).parse(formData.get("userId"));

  await db
    .update(users)
    .set({
      role: "admin",
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidateSettingsPages();
}

export async function demoteAdminToUser(formData: FormData) {
  const session = await requireAdmin();
  const userId = z.string().trim().min(1).parse(formData.get("userId"));

  if (session.user.id === userId) {
    throw new Error("Cannot remove your own admin access");
  }

  await db
    .update(users)
    .set({
      role: "user",
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidateSettingsPages();
}

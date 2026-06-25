import { eq } from "drizzle-orm";

import { db } from "@/db";
import { appSettings } from "@/db/schema";

export const DEFAULT_SETTINGS_ID = "default";
export const DEFAULT_ADMIN_WHATSAPP_NUMBER = "6281234567890";
export const DEFAULT_WHATSAPP_CONFIRMATION_TEMPLATE = [
  "Halo admin, saya sudah membuat booking.",
  "ID transaksi: {id}",
  "Nama: {name}",
  "Instansi: {institution}",
  "WhatsApp: {whatsapp}",
  "Tanggal: {date}",
  "Jam mulai: {start_time}",
  "Durasi: {duration_hours} jam",
  "Saya akan melakukan pembayaran via QRIS.",
].join("\n");

type AppSettingsRecord = typeof appSettings.$inferSelect;

function buildDefaultSettings(): AppSettingsRecord {
  const now = new Date();

  return {
    id: DEFAULT_SETTINGS_ID,
    adminWhatsappNumber: DEFAULT_ADMIN_WHATSAPP_NUMBER,
    whatsappConfirmationTemplate: DEFAULT_WHATSAPP_CONFIRMATION_TEMPLATE,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getAppSettings() {
  const [settings] = await db
    .select()
    .from(appSettings)
    .where(eq(appSettings.id, DEFAULT_SETTINGS_ID))
    .limit(1);

  if (settings) {
    return settings;
  }

  const defaults = buildDefaultSettings();
  await db.insert(appSettings).values(defaults);
  return defaults;
}

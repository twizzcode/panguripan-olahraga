import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { appSettings } from "@/db/schema";

export const DEFAULT_SETTINGS_ID = "default";
export const DEFAULT_ADMIN_WHATSAPP_NUMBER = "6281234567890";
export const DEFAULT_BOOKING_HOURLY_RATE = 150000;
export const DEFAULT_WHATSAPP_CONFIRMATION_TEMPLATE = [
  "Halo admin, saya sudah membuat booking.",
  "ID transaksi: {id}",
  "Nama: {name}",
  "Instansi: {institution}",
  "WhatsApp: {whatsapp}",
  "Tanggal: {date}",
  "Jam mulai: {start_time}",
  "Durasi: {duration_hours} jam",
  "Total bayar: {amount}",
  "Saya akan melakukan pembayaran via QRIS.",
].join("\n");

type AppSettingsRecord = typeof appSettings.$inferSelect;

function buildDefaultSettings(): AppSettingsRecord {
  const now = new Date();

  return {
    id: DEFAULT_SETTINGS_ID,
    adminWhatsappNumber: DEFAULT_ADMIN_WHATSAPP_NUMBER,
    bookingHourlyRate: DEFAULT_BOOKING_HOURLY_RATE,
    whatsappConfirmationTemplate: DEFAULT_WHATSAPP_CONFIRMATION_TEMPLATE,
    createdAt: now,
    updatedAt: now,
  };
}

function isMissingBookingHourlyRateColumnError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.toLowerCase().includes("booking_hourly_rate")
  );
}

export async function hasBookingHourlyRateColumn() {
  const result = await db.execute(sql`
    select exists (
      select 1
      from information_schema.columns
      where table_name = 'app_settings'
        and column_name = 'booking_hourly_rate'
    ) as exists
  `);

  return Boolean((result.rows[0] as { exists?: boolean } | undefined)?.exists);
}

async function getLegacyAppSettings() {
  const result = await db.execute(sql`
    select
      id,
      admin_whatsapp_number,
      whatsapp_confirmation_template,
      created_at,
      updated_at
    from app_settings
    where id = ${DEFAULT_SETTINGS_ID}
    limit 1
  `);

  const row = result.rows[0] as
    | {
        id: string;
        admin_whatsapp_number: string;
        whatsapp_confirmation_template: string;
        created_at: Date;
        updated_at: Date;
      }
    | undefined;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    adminWhatsappNumber: row.admin_whatsapp_number,
    bookingHourlyRate: DEFAULT_BOOKING_HOURLY_RATE,
    whatsappConfirmationTemplate: row.whatsapp_confirmation_template,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  } satisfies AppSettingsRecord;
}

async function insertDefaultAppSettings(includeBookingHourlyRate: boolean) {
  const defaults = buildDefaultSettings();

  if (includeBookingHourlyRate) {
    await db.insert(appSettings).values(defaults);
    return defaults;
  }

  await db.execute(sql`
    insert into app_settings (
      id,
      admin_whatsapp_number,
      whatsapp_confirmation_template,
      created_at,
      updated_at
    ) values (
      ${defaults.id},
      ${defaults.adminWhatsappNumber},
      ${defaults.whatsappConfirmationTemplate},
      ${defaults.createdAt},
      ${defaults.updatedAt}
    )
  `);

  return defaults;
}

export async function getAppSettings() {
  try {
    const [settings] = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.id, DEFAULT_SETTINGS_ID))
      .limit(1);

    if (settings) {
      return settings;
    }

    return insertDefaultAppSettings(true);
  } catch (error) {
    if (!isMissingBookingHourlyRateColumnError(error)) {
      throw error;
    }

    const settings = await getLegacyAppSettings();

    if (settings) {
      return settings;
    }

    return insertDefaultAppSettings(false);
  }
}

import {
  boolean,
  integer,
  index,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  role: text("role").notNull().default("user"),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
}, (table) => ({
  emailUnique: unique("user_email_unique").on(table.email),
}));

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
}, (table) => ({
  tokenUnique: unique("session_token_unique").on(table.token),
  userIdIdx: index("session_user_id_idx").on(table.userId),
}));

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
}, (table) => ({
  providerAccountUnique: unique("account_provider_account_unique").on(
    table.providerId,
    table.accountId
  ),
  userIdIdx: index("account_user_id_idx").on(table.userId),
}));

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
}, (table) => ({
  identifierValueUnique: unique("verification_identifier_value_unique").on(
    table.identifier,
    table.value
  ),
}));

export const trainings = pgTable("training", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoSrc: text("video_src").notNull(),
  thumbnailSrc: text("thumbnail_src").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const appSettings = pgTable("app_settings", {
  id: text("id").primaryKey(),
  adminWhatsappNumber: text("admin_whatsapp_number").notNull(),
  whatsappConfirmationTemplate: text("whatsapp_confirmation_template").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const bookings = pgTable(
  "booking",
  {
    id: text("id").primaryKey(),
    transactionId: text("transaction_id").notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    status: text("status").notNull().default("pending"),
    approvalStatus: text("approval_status").notNull().default("pending"),
    name: text("name").notNull(),
    institution: text("institution").notNull(),
    whatsapp: text("whatsapp").notNull(),
    durationHours: integer("duration_hours").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    transactionIdUnique: unique("booking_transaction_id_unique").on(
      table.transactionId
    ),
    userIdIdx: index("booking_user_id_idx").on(table.userId),
    startsAtIdx: index("booking_starts_at_idx").on(table.startsAt),
    endsAtIdx: index("booking_ends_at_idx").on(table.endsAt),
  })
);

export const authSchema = {
  user: users,
  session: sessions,
  account: accounts,
  verification: verifications,
};

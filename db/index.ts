import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/lib/env";
import {
  accounts,
  appSettings,
  bookings,
  sessions,
  trainings,
  users,
  verifications,
} from "@/db/schema";

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, {
  schema: {
    users,
    sessions,
    accounts,
    verifications,
    trainings,
    bookings,
    appSettings,
  },
});

export type Database = typeof db;

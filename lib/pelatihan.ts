import { asc } from "drizzle-orm";

import { db } from "@/db";
import { trainings } from "@/db/schema";

export async function getTrainings() {
  return db.select().from(trainings).orderBy(asc(trainings.sortOrder), asc(trainings.createdAt));
}

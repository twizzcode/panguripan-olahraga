"use server";

import { revalidatePath } from "next/cache";
import { eq, gt, lt, asc, desc } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { trainings } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { normalizeVideoUrl } from "@/lib/youtube";

const trainingSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  videoSrc: z.string().trim().url(),
  thumbnailSrc: z.string().trim().url(),
});

async function requireAdmin() {
  const session = await getSession();

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  return session;
}

function revalidateTrainingPages() {
  revalidatePath("/pelatihan");
  revalidatePath("/admin/pelatihan");
}

export async function createTraining(formData: FormData) {
  await requireAdmin();

  const values = trainingSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    videoSrc: formData.get("videoSrc"),
    thumbnailSrc: formData.get("thumbnailSrc"),
  });

  const now = new Date();
  
  const maxOrder = await db
    .select({ max: trainings.sortOrder })
    .from(trainings)
    .then(rows => rows[0]?.max ?? -1);

  await db.insert(trainings).values({
    id: crypto.randomUUID(),
    title: values.title,
    description: values.description,
    videoSrc: normalizeVideoUrl(values.videoSrc),
    thumbnailSrc: values.thumbnailSrc,
    sortOrder: maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  });

  revalidateTrainingPages();
}

export async function updateTraining(formData: FormData) {
  await requireAdmin();

  const id = z.string().trim().min(1).parse(formData.get("id"));
  const values = trainingSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    videoSrc: formData.get("videoSrc"),
    thumbnailSrc: formData.get("thumbnailSrc"),
  });

  await db
    .update(trainings)
    .set({
      title: values.title,
      description: values.description,
      videoSrc: normalizeVideoUrl(values.videoSrc),
      thumbnailSrc: values.thumbnailSrc,
      updatedAt: new Date(),
    })
    .where(eq(trainings.id, id));

  revalidateTrainingPages();
}

export async function deleteTraining(formData: FormData) {
  await requireAdmin();

  const id = z.string().trim().min(1).parse(formData.get("id"));

  await db.delete(trainings).where(eq(trainings.id, id));

  revalidateTrainingPages();
}

export async function reorderTraining(formData: FormData) {
  await requireAdmin();

  const id = z.string().trim().min(1).parse(formData.get("id"));
  const direction = z.enum(["up", "down"]).parse(formData.get("direction"));

  const current = await db
    .select()
    .from(trainings)
    .where(eq(trainings.id, id))
    .then(rows => rows[0]);

  if (!current) return;

  if (direction === "up") {
    const previous = await db
      .select()
      .from(trainings)
      .where(lt(trainings.sortOrder, current.sortOrder))
      .orderBy(desc(trainings.sortOrder))
      .limit(1)
      .then(rows => rows[0]);

    if (previous) {
      await db
        .update(trainings)
        .set({ sortOrder: previous.sortOrder })
        .where(eq(trainings.id, current.id));

      await db
        .update(trainings)
        .set({ sortOrder: current.sortOrder })
        .where(eq(trainings.id, previous.id));
    }
  } else {
    const next = await db
      .select()
      .from(trainings)
      .where(gt(trainings.sortOrder, current.sortOrder))
      .orderBy(asc(trainings.sortOrder))
      .limit(1)
      .then(rows => rows[0]);

    if (next) {
      await db
        .update(trainings)
        .set({ sortOrder: next.sortOrder })
        .where(eq(trainings.id, current.id));

      await db
        .update(trainings)
        .set({ sortOrder: current.sortOrder })
        .where(eq(trainings.id, next.id));
    }
  }

  revalidateTrainingPages();
}

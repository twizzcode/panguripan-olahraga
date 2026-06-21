"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { trainings } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { normalizeVideoUrl } from "@/lib/youtube";

const trainingSchema = z.object({
  title: z.string().trim().min(1),
  duration: z.string().trim().min(1),
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
    duration: formData.get("duration"),
    videoSrc: formData.get("videoSrc"),
    thumbnailSrc: formData.get("thumbnailSrc"),
  });

  const now = new Date();

  await db.insert(trainings).values({
    id: crypto.randomUUID(),
    title: values.title,
    duration: values.duration,
    videoSrc: normalizeVideoUrl(values.videoSrc),
    thumbnailSrc: values.thumbnailSrc,
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
    duration: formData.get("duration"),
    videoSrc: formData.get("videoSrc"),
    thumbnailSrc: formData.get("thumbnailSrc"),
  });

  await db
    .update(trainings)
    .set({
      title: values.title,
      duration: values.duration,
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

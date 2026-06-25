import { AdminTrainingManager } from "@/components/admin-training-manager"
import { getTrainings } from "@/lib/pelatihan"

export default async function AdminPelatihanPage() {
  const trainings = await getTrainings()

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <AdminTrainingManager trainings={trainings} />
    </section>
  )
}

import { getTrainings } from "@/lib/pelatihan"
import { PelatihanVideoList } from "@/components/pelatihan-video-list"

export default async function PelatihanPage() {
  const trainingVideos = await getTrainings()

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <section className="px-4 pt-8 text-center sm:px-6 sm:pt-12 lg:px-10 lg:pt-16">
        <div className="mx-auto max-w-5xl space-y-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-brand sm:text-5xl lg:text-7xl">
            KLINIK PELATIH MUDA
          </h1>
          <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Kompilasi berbagai referensi video praktik latihan fisik sepak bola dari platform YouTube, mulai dari HIIT, kelincahan, kecepatan, hingga kombinasi koordinasi bola untuk membantu menyusun program latihan yang terstruktur dan efektif.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        {trainingVideos.length ? (
          <PelatihanVideoList trainings={trainingVideos} />
        ) : (
          <section className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Belum ada video pelatihan yang dipublikasikan.
          </section>
        )}
      </section>
    </div>
  )
}

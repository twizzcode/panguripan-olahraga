import { IconBrandYoutubeFilled, IconClockHour4 } from "@tabler/icons-react"

import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
import { getTrainings } from "@/lib/pelatihan"
import { normalizeVideoUrl } from "@/lib/youtube"

export default async function PelatihanPage() {
  const trainingVideos = await getTrainings()

  return (
    <div className="flex flex-col gap-12 sm:gap-16">
      <section className="px-4 pt-8 text-center sm:px-6 sm:pt-12 lg:px-10 lg:pt-16">
        <div className="mx-auto max-w-5xl space-y-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Pelatihan untuk mempercepat ritme tim booking.
          </h1>
          <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Kumpulan video praktik, workflow, dan materi internal untuk
            membantu tim memahami alur booking, CRM, dan eksekusi harian dengan
            lebih rapi.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        {trainingVideos.length ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {trainingVideos.map((video) => (
              <article key={video.id} className="space-y-4">
                <HeroVideoDialog
                  animationStyle="from-center"
                  videoSrc={normalizeVideoUrl(video.videoSrc)}
                  thumbnailSrc={video.thumbnailSrc}
                  thumbnailAlt={video.title}
                  className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-2 shadow-sm"
                />

                <div className="space-y-3 px-1">
                  <h3 className="text-xl font-semibold tracking-tight">
                    {video.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-3 py-1">
                      <IconBrandYoutubeFilled className="size-4 text-red-500" />
                      Video
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-3 py-1">
                      <IconClockHour4 className="size-4" />
                      {video.duration}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Belum ada video pelatihan yang dipublikasikan.
          </section>
        )}
      </section>
    </div>
  )
}

"use client"

import { motion } from "motion/react"
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
import { normalizeVideoUrl } from "@/lib/youtube"

type Training = {
  id: string
  title: string
  description: string
  videoSrc: string
  thumbnailSrc: string
}

export function PelatihanVideoList({ trainings }: { trainings: Training[] }) {
  return (
    <div className="grid gap-24">
      {trainings.map((video, index) => (
        <motion.article
          key={video.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          className="space-y-6"
        >
          <h3 className="text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            {video.title}
          </h3>
          
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc={normalizeVideoUrl(video.videoSrc)}
            thumbnailSrc={video.thumbnailSrc}
            thumbnailAlt={video.title}
            className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-2 shadow-sm"
          />

          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            {video.description}
          </p>
        </motion.article>
      ))}
    </div>
  )
}

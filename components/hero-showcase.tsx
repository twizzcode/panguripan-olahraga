"use client"

import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export function HeroShowcase() {
  return (
    <section className="grid min-h-[calc(100svh-4rem-1.5rem)] content-center gap-10 py-2 lg:-translate-y-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-8 lg:py-0 xl:gap-12">
      <div className="space-y-7 lg:space-y-9">
        <div className="inline-flex w-fit items-center gap-3 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground">
          <span>Your Website Builder</span>
          <IconArrowRight className="size-4" />
        </div>

        <div className="space-y-5">
          <h1 className="max-w-xl text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            Shadcn UI
            <br />
            Components built
            <br />
            for production
          </h1>
          <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            Finely crafted components built with React, Tailwind and
            shadcn/ui. Developers can copy and paste these blocks directly into
            their project.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button asChild size="lg" className="rounded-md px-5">
            <a href="#features">Discover all components</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-md px-5">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              View on GitHub
              <IconArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[1.05fr_0.95fr] gap-3 sm:gap-4">
        <AspectRatio ratio={0.74} className="overflow-hidden rounded-3xl bg-[#eef1f7] ring-1 ring-black/6">
          <div className="relative size-full bg-[radial-gradient(circle_at_72%_48%,rgba(255,255,255,0.85),transparent_28%),linear-gradient(180deg,#f5f7fb_0%,#e8edf5_38%,#dbe2ee_100%)]">
            <div className="absolute left-[42%] top-[-8%] h-[80%] w-[15%] rounded-full bg-[#d8dee8]" />
            <div className="absolute left-[47%] top-[26%] size-[28%] -translate-x-1/2 rounded-full border-[10px] border-[#4e5564] bg-[#d5dce8] shadow-[inset_-10px_-12px_18px_rgba(88,98,118,0.15)]" />
            <div className="absolute left-[47%] top-[26%] size-[14%] -translate-x-1/2 rounded-full bg-[#edf1f7] ring-1 ring-[#bcc5d4]" />
            <div className="absolute left-[47%] top-[40%] h-[72%] w-[12%] -translate-x-1/2 rounded-full bg-[#e1e7f0]" />
            <div className="absolute left-[8%] top-[44%] h-[16%] w-[54%] rounded-full bg-[#dbe2ee] [transform:rotate(-55deg)]" />
            <div className="absolute left-[42%] top-[2%] h-[46%] w-[12%] rounded-full bg-[#e7ecf4] [transform:rotate(12deg)]" />
            <div className="absolute left-[53%] top-[38%] h-[12%] w-[18%] rounded-full bg-[#4f5664]" />
          </div>
        </AspectRatio>

        <div className="grid gap-3 sm:gap-4">
          <AspectRatio ratio={1.12} className="overflow-hidden rounded-3xl bg-[#eef1f7] ring-1 ring-black/6">
            <div className="relative size-full bg-[radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.92),transparent_18%),linear-gradient(180deg,#f5f7fb_0%,#e9edf5_40%,#dde4ef_100%)]">
              <div className="absolute left-[26%] top-[-8%] h-[86%] w-[9%] rounded-full bg-[#d9dfeb]" />
              <div className="absolute left-[33%] top-[26%] size-[25%] rounded-full bg-[#d4dbe8]" />
              <div className="absolute left-[38%] top-[26%] h-[22%] w-[38%] rounded-[2rem] bg-[#e7edf6] ring-1 ring-[#c0c8d6]" />
              <div className="absolute left-[46%] top-[35%] flex gap-2">
                <span className="h-6 w-4 bg-[#111318]" />
                <span className="h-6 w-4 bg-[#111318]" />
              </div>
            </div>
          </AspectRatio>

          <AspectRatio ratio={1.12} className="overflow-hidden rounded-3xl bg-[#eef1f7] ring-1 ring-black/6">
            <div className="relative size-full bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.88),transparent_18%),linear-gradient(180deg,#f7f8fb_0%,#eceff6_38%,#dee5ef_100%)]">
              <div className="absolute left-[47%] top-[18%] h-[68%] w-[8%] -translate-x-1/2 rounded-full bg-[#d6ddea]" />
              <div className="absolute left-[47%] top-[42%] size-[13%] -translate-x-1/2 rounded-full bg-[#cfd7e4]" />
              <div className="absolute left-[27%] top-[42%] h-[9%] w-[34%] rounded-full bg-[#dfe5ef] [transform:rotate(-32deg)]" />
              <div className="absolute left-[47%] top-[28%] h-[8%] w-[32%] rounded-full bg-[#e5ebf5] [transform:rotate(82deg)]" />
              <div className="absolute left-[49%] top-[43%] h-[8%] w-[34%] rounded-full bg-[#e0e6f0] [transform:rotate(27deg)]" />
            </div>
          </AspectRatio>
        </div>
      </div>
    </section>
  )
}

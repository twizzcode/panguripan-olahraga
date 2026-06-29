"use client"

import Image from "next/image"
import { IconArrowRight } from "@tabler/icons-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"

export function HeroShowcase() {
  return (
    <section className="grid min-h-[calc(100svh-4rem-1.5rem)] content-center gap-10 py-2 lg:-translate-y-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:py-0">
      <motion.div
        className="space-y-8 lg:space-y-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="inline-flex w-fit items-center gap-3 rounded-full bg-brand/10 px-6 py-2 text-sm font-medium text-brand"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <span>Berawal dari tekad untuk memajukan potensi olahraga Desa Galang Pengampon</span>
          <IconArrowRight className="size-4" />
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <h1 className="max-w-xl text-5xl uppercase font-bold leading-[0.95] tracking-tight text-brand sm:text-6xl lg:text-7xl">
            Panguripan
            <br />
            Olahraga
          </h1>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            Sebuah Program Kreativitas Mahasiswa bidang Pengabdian kepada Masyarakat (PKM-PM) dengan luaran yang mengintegrasikan <span className="italic">website</span> pengelolaan jadwal penggunaan lapangan dan akses video panduan kepelatihan pelatih sepak bola demi menciptakan sistem pemuda yang terstruktur dan berkelanjutan.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-3 pt-2 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        >
          <Button asChild size="lg" className="rounded-md px-5 bg-brand hover:bg-brand/90">
            <a href="/jadwal-lapangan">Jadwal Lapangan</a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-md px-5 border-brand text-brand hover:bg-brand/10">
            <a href="/klinik-pelatih">Klinik Pelatih</a>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex items-center justify-center lg:justify-end"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      >
        <Image
          src="/maskot.png"
          alt="Maskot Panguripan Olahraga"
          width={900}
          height={900}
          className="w-full"
          priority
        />
      </motion.div>
    </section>
  )
}

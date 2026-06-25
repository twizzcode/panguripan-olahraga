"use client"

import {
  IconCalendarEvent,
  IconPlayerPlay,
} from "@tabler/icons-react";
import Image from "next/image";
import { motion } from "motion/react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const LogoIcon = () => (
  <Image 
    src="/logo.png" 
    alt="Logo" 
    width={48} 
    height={48}
    className="h-12 w-12"
  />
);

const features = [
  {
    Icon: LogoIcon,
    name: "Halaman Utama Panguripan Olahraga",
    description:
      "Baca selengkapnya mengenai PKM-PM di Desa Galang Pengampon.",
    href: "#about",
    cta: "Lihat section",
    background: (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,0,0,0.08),_transparent_45%),linear-gradient(135deg,_rgba(0,0,0,0.03),_transparent_60%)]" />
    ),
    className: "col-span-1",
  },
  {
    Icon: IconCalendarEvent,
    name: "Jadwal Lapangan Galang Pengampon",
    description:
      "Lihat daftar ketersediaan waktu dan atur jadwal pemakaian lapangan desa.",
    href: "/booking",
    cta: "Buka jadwal",
    background: (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,0,0,0.08),_transparent_45%),linear-gradient(180deg,_rgba(0,0,0,0.02),_transparent_70%)]" />
    ),
    className: "col-span-1",
  },
  {
    Icon: IconPlayerPlay,
    name: "Klinik Pelatih Muda",
    description:
      "Akses materi edukasi pelatih sepak bola yang efektif dan mudah dipelajari.",
    href: "/pelatihan",
    cta: "Lihat pelatihan",
    background: (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.06),_transparent_40%),linear-gradient(225deg,_rgba(0,0,0,0.03),_transparent_70%)]" />
    ),
    className: "col-span-1",
  },
];

export function BentoDemo() {
  return (
    <BentoGrid className="grid-cols-1 md:grid-cols-3">
      {features.map((feature, index) => (
        <motion.div
          key={feature.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.5,
            delay: index * 0.15,
            ease: "easeOut"
          }}
        >
          <BentoCard {...feature} />
        </motion.div>
      ))}
    </BentoGrid>
  );
}

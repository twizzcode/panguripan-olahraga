import {
  IconCalendarEvent,
  IconLayoutGrid,
  IconPlayerPlay,
} from "@tabler/icons-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: IconLayoutGrid,
    name: "Tentang Booking",
    description:
      "Lihat ringkasan alur platform, cara kerja operasional, dan fokus utama produk ini.",
    href: "#about",
    cta: "Lihat section",
    background: (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,0,0,0.08),_transparent_45%),linear-gradient(135deg,_rgba(0,0,0,0.03),_transparent_60%)]" />
    ),
    className: "col-span-1",
  },
  {
    Icon: IconCalendarEvent,
    name: "Booking Lapangan",
    description:
      "Cek jadwal yang tersedia, pilih slot waktu, dan lanjutkan booking lapangan secara langsung.",
    href: "/booking",
    cta: "Buka booking",
    background: (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,0,0,0.08),_transparent_45%),linear-gradient(180deg,_rgba(0,0,0,0.02),_transparent_70%)]" />
    ),
    className: "col-span-1",
  },
  {
    Icon: IconPlayerPlay,
    name: "Pelatihan",
    description:
      "Akses materi video untuk memahami alur kerja, ritme operasional, dan eksekusi harian tim.",
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
    <BentoGrid className="grid-cols-1 auto-rows-[18rem] md:grid-cols-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

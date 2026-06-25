import { Metadata } from "next"
import { BentoDemo } from "@/components/bento-section"
import { HeroShowcase } from "@/components/hero-showcase"
import { AboutSection } from "@/components/about-section"

export const metadata: Metadata = {
  title: "Beranda",
  description: "Platform digital sebagai alat bantu untuk mengatur jadwal lapangan dan pembelajaran kepelatihan sepak bola.",
}

export default function Home() {
  return (
    <>
      <HeroShowcase />

      <section id="features">
        <BentoDemo />
      </section>

      <AboutSection />
    </>
  )
}

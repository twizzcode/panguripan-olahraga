import { BentoDemo } from "@/components/bento-section"
import { HeroShowcase } from "@/components/hero-showcase"
import { AboutSection } from "@/components/about-section"

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

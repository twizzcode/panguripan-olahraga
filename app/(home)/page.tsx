import { BentoDemo } from "@/components/bento-section"
import { HeroShowcase } from "@/components/hero-showcase"

export default function Home() {
  return (
    <>
      <HeroShowcase />

      <section id="features">
        <BentoDemo />
      </section>

      {/* eslint-disable @next/next/no-img-element */}
      <section id="about" className="w-full pt-16 sm:pt-24 lg:pt-32">
        <div className="flex flex-col items-center justify-start gap-6 lg:flex-row">
          <div className="flex w-full flex-col items-start justify-start gap-12 lg:w-1/2 lg:gap-24">
            <div className="pr-0 lg:pr-6">
              <h2 className="mb-5 text-3xl font-semibold tracking-tight md:text-4xl lg:mb-8 lg:text-5xl">
                Tentang Booking
              </h2>
              <p className="mb-8 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                Kami membangun alur booking yang lebih rapi untuk tim dan user:
                mulai dari cek jadwal lapangan, buat reservasi, lanjut
                pembayaran, sampai akses materi pelatihan dalam satu platform
                yang sama.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
              <img
                alt="Suasana area booking dan operasional"
                className="aspect-[0.7] w-full rounded-lg object-cover md:w-1/2"
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-MChSQHxGZrQ-unsplash.jpg"
              />
              <div className="flex w-full flex-col items-center justify-center gap-6 md:w-1/2">
                <img
                  alt="Kolaborasi tim operasional"
                  className="aspect-[1.1] rounded-lg object-cover"
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-AkftcHujUmk-unsplash.jpg"
                />
                <img
                  alt="Perencanaan jadwal dan layanan"
                  className="aspect-[0.7] rounded-lg object-cover"
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-vGgn0xLdy8s-unsplash.jpg"
                />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-12 pt-6 lg:w-1/2 lg:pt-32">
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
              <img
                alt="Ruang kerja tim"
                className="aspect-[0.9] w-full rounded-lg object-cover md:w-1/2"
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/johnson-wang-iI4sR_nkkbc-unsplash.jpg"
              />
              <div className="flex w-full flex-col items-center justify-center gap-6 md:w-1/2">
                <img
                  alt="Pengelolaan materi pelatihan"
                  className="aspect-[0.8] rounded-lg object-cover"
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/nastuh-abootalebi-eHD8Y1Znfpk-unsplash.jpg"
                />
                <img
                  alt="Aktivitas dukungan operasional"
                  className="aspect-[0.9] rounded-lg object-cover"
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/alvin-engler-bIhpiQA009k-unsplash.jpg"
                />
              </div>
            </div>

            <div className="px-0 lg:px-8">
              <h3 className="mb-5 text-xl font-semibold tracking-tight sm:text-2xl lg:mb-6">
                Cara kami bekerja
              </h3>
              <p className="mb-6 text-sm leading-7 text-foreground sm:text-base sm:leading-8">
                Fokus kami bukan cuma menerima booking, tapi memastikan proses
                setelahnya tetap jelas: status pembayaran mudah dipantau, admin
                bisa memilah booking berdasarkan kondisi, dan user tetap punya
                akses ke riwayat transaksinya.
              </p>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                Di sisi internal, halaman pelatihan membantu tim memahami alur
                kerja dan materi operasional tanpa perlu berpindah-pindah alat.
                Hasilnya, proses harian lebih cepat, minim miskomunikasi, dan
                lebih mudah dijaga kualitasnya.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* eslint-enable @next/next/no-img-element */}
    </>
  )
}

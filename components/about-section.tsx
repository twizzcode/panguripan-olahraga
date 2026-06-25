"use client"

import Image from "next/image"
import { motion } from "motion/react"

export function AboutSection() {
  return (
    <section id="about" className="w-full py-16 sm:py-24 lg:py-32">
      <div className="space-y-20 sm:space-y-24 lg:space-y-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-brand sm:text-4xl lg:text-5xl">
            Program Kreativitas Mahasiswa
          </h2>
          <p className="max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            Program Kreativitas Mahasiswa bidang Pengabdian kepada Masyarakat (PKM-PM) tahun 2026 oleh Direktorat Pembelajaran dan Kemahasiswaan (Belmawa) merupakan program penerapan ilmu pengetahuan, teknologi, dan seni (IPTEKS) untuk membantu meningkatkan kualitas hidup masyarakat mitra nirlaba yang mengacu pada tema ke-6, yaitu Penguatan Pendidikan, Sains, dan Teknologi.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <Image
            src="/dikti.png"
            alt="Logo Dikti dan Partner"
            width={1200}
            height={200}
            className="w-full max-w-5xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            Tentang Panguripan Olahraga
          </h2>
          <p className="mb-12 max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            Program "Panguripan Olahraga" Universitas Negeri Semarang dirancang berdasarkan latar belakang lemahnya tata kelola organisasi keolahragaan dan rendahnya kompetensi Karang Taruna Tunas Bangkit Desa Galang Pengampon Pekalangan menjadi model pemberdayaan berbasis pendekatan self-help melalui empat sesi tahap pelaksanaan.
          </p>

          <div className="ml-3.5">
            <motion.div
              className="relative flex items-start pb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <div className="absolute left-[6px] top-[2.75rem] h-[calc(100%-2.75rem)] w-px bg-brand/40"></div>
              <div className="absolute ml-[-14px] py-2">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white text-base font-bold">
                  1
                </div>
              </div>
              <div className="pl-16">
                <h3 className="mt-2 text-xl font-semibold text-brand sm:text-2xl">
                  Wruh Raga
                </h3>
                <p className="max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Sesi peningkatan literasi komunitas olahraga melalui sosialisasi dan <span className="italic">Focus Group Discussion</span> (FGD) untuk membangun kesadaran awal, komitmen mitra, serta menghasilkan dokumen SK Tim Pengelola Olahraga Desa Galang Pengampon beserta deskripsi kerja setiap bidang kegiatan dan prasarana.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative flex items-start pb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <div className="absolute left-[6px] top-[2.75rem] h-[calc(100%-2.75rem)] w-px bg-brand/40"></div>
              <div className="absolute ml-[-14px] py-2">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white text-base font-bold">
                  2
                </div>
              </div>
              <div className="pl-16">
                <h3 className="mt-2 text-xl font-semibold text-brand sm:text-2xl">
                  Mulat Subuda
                </h3>
                <p className="max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Sesi pelatihan berbasis modul dan uji praktik yang dioptimalkan dengan integrasi platform digital sederhana untuk mencetak 10 peserta kompeten dalam tata kelola kegiatan dan 5 peserta kompeten dalam dasar coaching sepak bola berdasarkan instrumen rubrik penilaian.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative flex items-start pb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <div className="absolute left-[6px] top-[2.75rem] h-[calc(100%-2.75rem)] w-px bg-brand/40"></div>
              <div className="absolute ml-[-14px] py-2">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white text-base font-bold">
                  3
                </div>
              </div>
              <div className="pl-16">
                <h3 className="mt-2 text-xl font-semibold text-brand sm:text-2xl">
                  Tumuwuh Mardika
                </h3>
                <p className="max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Sesi uji mandiri melalui pendekataan self-help di mana mitra menguji ketahanan organisasi secara langsung melalui penyelenggaraan turnamen "Festival Sepak Bola Desa" dan pelaksanaan latihan rutin mingguan bernama "Klinik Pelatih Muda".
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative flex items-start pb-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            >
              <div className="absolute ml-[-14px] py-2">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white text-base font-bold">
                  4
                </div>
              </div>
              <div className="pl-16">
                <h3 className="mt-2 text-xl font-semibold text-brand sm:text-2xl">
                  Rahayu Panguripan
                </h3>
                <p className="max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  Sesi akhir yang berfokus pada institusionalisasi dan keberlanjutan program melalui peresmian tim pengelola, penyerahan buku pedoman mitra, penyusunan kalender kegiatan rutin setiap 6 bulan pasca-program, serta penyerahan hak akses data pengelolaan yang lengkap.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.p
            className="mt-12 max-w-4xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            Salah satu luaran dari pelaksanaan program ini yaitu <span className="font-medium italic">website</span> "Panguripan Olahraga" yang secara komprehensif mengintegrasikan sistem manajemen digital jadwal lapangan desa, serta platform edukasi "Klinik Pelatih Muda" berisi kompilasi video panduan kepelatihan sepak bola sebagai instrumen keberlanjutan.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

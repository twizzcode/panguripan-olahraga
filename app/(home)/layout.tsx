import { SimpleNavbar } from "@/components/simple-navbar"
import { SiteFooter } from "@/components/site-footer"

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-svh bg-background">
      <SimpleNavbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}

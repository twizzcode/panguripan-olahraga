"use client"

import { useMemo, useState, useTransition } from "react"
import {
  IconChevronRightFilled,
  IconHistory,
  IconLayoutDashboard,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { siteConfig } from "@/lib/site-config"

const navItems = [
  { name: "Halaman Utama", href: "/" },
  { name: "Jadwal Lapangan", href: "/booking" },
  { name: "Klinik Pelatih", href: "/pelatihan" },
]

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "User"
  const parts = source.split(/\s+/).filter(Boolean)

  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("")
}

export function SimpleNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSigningOut, startTransition] = useTransition()
  const router = useRouter()
  const session = authClient.useSession()
  const user = session.data?.user
  const isLoggedIn = Boolean(user)
  const isAdmin = Boolean(
    user &&
      "role" in user &&
      typeof user.role === "string" &&
      user.role === "admin"
  )
  const initials = useMemo(
    () => getInitials(user?.name, user?.email),
    [user?.email, user?.name]
  )

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setIsOpen(false)
            router.refresh()
          },
        },
      })
    })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-brand backdrop-blur">
      <div className="relative mx-auto flex h-20 w-full max-w-6xl items-center px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt={siteConfig.name}
              width={56}
              height={56}
              className="h-14 w-auto"
            />
          </Link>
        </div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-base font-medium text-brand-foreground/70 transition-colors hover:text-brand-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden flex-1 items-center justify-end md:flex">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full transition-colors hover:bg-muted"
                  aria-label="Open user menu"
                >
                  <Avatar size="lg">
                    <AvatarImage
                      src={user?.image ?? undefined}
                      alt={user?.name ?? "User avatar"}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 min-w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                {isAdmin ? (
                  <DropdownMenuItem
                    onSelect={() => {
                      router.push("/admin")
                    }}
                  >
                    <IconLayoutDashboard className="size-4" />
                    Admin
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem>
                  <IconUserCircle className="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    router.push("/riwayat-booking")
                  }}
                >
                  <IconHistory className="size-4" />
                  Riwayat booking
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={handleSignOut}
                  disabled={isSigningOut}
                >
                  <IconLogout className="size-4" />
                  {isSigningOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="px-4 text-brand-foreground/70 hover:bg-brand-foreground/10 hover:text-brand-foreground"
              variant="ghost"
            >
              <Link href="/login">
                Login
                <IconChevronRightFilled className="size-4" />
              </Link>
            </Button>
          )}
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-foreground/20 text-brand-foreground md:hidden"
        >
          <span className="text-lg leading-none">{isOpen ? "x" : "="}</span>
        </button>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 top-full z-50 md:hidden",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-[calc(100svh-4rem)] bg-background/45 backdrop-blur-sm transition-opacity duration-200",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={cn(
            "relative mx-4 mt-3 rounded-3xl border border-border/70 bg-background/95 p-5 shadow-xl backdrop-blur-xl transition-all duration-200 sm:mx-6",
            isOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          )}
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              {isLoggedIn ? (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-full justify-center px-0"
                  >
                    <Link
                      href="/riwayat-booking"
                      onClick={() => setIsOpen(false)}
                    >
                      Riwayat booking
                      <IconHistory className="size-4" />
                    </Link>
                  </Button>
                  {isAdmin ? (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full justify-center px-0"
                    >
                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        Admin
                        <IconLayoutDashboard className="size-4" />
                      </Link>
                    </Button>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-2 text-sm font-medium text-destructive"
                    disabled={isSigningOut}
                  >
                    <IconLogout className="size-4" />
                    {isSigningOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <Button
                  asChild
                  className="w-full rounded-full justify-center px-0"
                >
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Login
                    <IconChevronRightFilled className="size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

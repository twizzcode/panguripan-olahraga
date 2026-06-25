"use client"

import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChevronsUpDown,
  Command,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  IconBook2,
  IconHome2,
  IconCalendarStats,
  IconLayoutDashboard,
  IconSettings,
} from "@tabler/icons-react"
import { authClient } from "@/lib/auth-client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image';

const adminNavItems = [
  { title: "Dasbor", href: "/admin", icon: IconLayoutDashboard },
  { title: "Jadwal", href: "/admin/jadwal-lapangan", icon: IconCalendarStats },
  { title: "Pelatihan", href: "/admin/klinik-pelatih", icon: IconBook2 },
  { title: "Pengaturan", href: "/admin/pengaturan", icon: IconSettings },
]

function getAdminPageTitle(pathname: string) {
  const matchedItem = adminNavItems.find((item) =>
    item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href)
  )

  if (matchedItem) {
    return matchedItem.title
  }

  const lastSegment = pathname.split("/").filter(Boolean).pop()

  if (!lastSegment) {
    return "Admin"
  }

  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
}

export function AdminSidebarShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile();
  const pageTitle = getAdminPageTitle(pathname)
  const session = authClient.useSession()
  const user = session.data?.user

  const initials = React.useMemo(() => {
    const source = user?.name?.trim() || user?.email?.trim() || "Admin"
    const parts = source.split(/\s+/).filter(Boolean)

    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
  }, [user?.email, user?.name])

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        },
      },
    })
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          {/* Team Switcher */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Pangurip Olahraga
                  </span>
                  <span className="truncate text-xs">
                    Admin
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* Team Switcher */}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigasi</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    item.href === "/admin"
                      ? pathname === item.href
                      : pathname.startsWith(item.href)

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <Icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-3 py-4">
          {/* Nav User */}
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.image ?? undefined}
                        alt={user?.name ?? "Admin avatar"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name ?? "Admin"}
                      </span>
                      <span className="truncate text-xs">
                        {user?.email ?? ""}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user?.image ?? undefined}
                          alt={user?.name ?? "Admin avatar"}
                        />
                        <AvatarFallback className="rounded-lg">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name ?? "Admin"}
                        </span>
                        <span className="truncate text-xs">
                          {user?.email ?? ""}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onSelect={() => {
                        router.push("/")
                      }}
                    >
                      <IconHome2 className="size-4" />
                      Home
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignOut}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* Nav User */}
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-h-svh">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/70 bg-background/95 px-4 backdrop-blur sm:px-6">
          <SidebarTrigger />
          <h1 className="min-w-0 text-lg font-semibold tracking-tight">
            {pageTitle}
          </h1>
        </header>

        <div className="flex flex-1 flex-col px-4 py-6 sm:px-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

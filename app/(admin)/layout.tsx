import { redirect } from "next/navigation"

import { AdminSidebarShell } from "@/components/admin-sidebar-shell"
import { getSession } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()

  if (!session) {
    redirect("/login?next=/admin")
  }

  if (session.user.role !== "admin") {
    redirect("/")
  }

  return <AdminSidebarShell>{children}</AdminSidebarShell>
}

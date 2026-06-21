import { and, asc, ilike, ne, or } from "drizzle-orm";

import {
  demoteAdminToUser,
  promoteUserToAdmin,
  updateAppSettings,
} from "@/app/(admin)/admin/pengaturan/actions";
import { AdminUserSearchInput } from "@/app/(admin)/admin/pengaturan/search-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getAppSettings } from "@/lib/app-settings";
import { getSession } from "@/lib/auth";
import { formatBookingPrice } from "@/lib/booking-pricing";

export const dynamic = "force-dynamic";

const templatePlaceholders = [
  "{id}",
  "{name}",
  "{institution}",
  "{whatsapp}",
  "{date}",
  "{start_time}",
  "{duration_hours}",
  "{amount}",
];

function getInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function AdminPengaturanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await getSession();
  const settings = await getAppSettings();
  const { q = "" } = await searchParams;
  const query = q.trim();

  const admins = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      image: users.image,
    })
    .from(users)
    .where(ilike(users.role, "admin"))
    .orderBy(asc(users.name));

  const searchResults = query
    ? await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          image: users.image,
        })
        .from(users)
        .where(
          and(
            ne(users.role, "admin"),
            or(ilike(users.name, `%${query}%`), ilike(users.email, `%${query}%`))
          )
        )
        .orderBy(asc(users.name))
        .limit(10)
    : [];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] xl:items-start">
      <div className="space-y-6">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">WhatsApp admin</h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Nomor ini dipakai untuk tombol konfirmasi pembayaran user pada halaman
              booking.
            </p>
          </div>

          <form action={updateAppSettings} className="mt-6 space-y-5">
            <input
              type="hidden"
              name="bookingHourlyRate"
              value={settings.bookingHourlyRate}
            />
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="admin-whatsapp-number">
                  Nomor WhatsApp admin
                </FieldLabel>
                <Input
                  id="admin-whatsapp-number"
                  name="adminWhatsappNumber"
                  defaultValue={settings.adminWhatsappNumber}
                  placeholder="6281234567890"
                  required
                />
                <FieldDescription>
                  Gunakan format internasional tanpa tanda plus, misalnya
                  `6281234567890`.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="whatsapp-template">
                  Template konfirmasi user
                </FieldLabel>
                <textarea
                  id="whatsapp-template"
                  name="whatsappConfirmationTemplate"
                  defaultValue={settings.whatsappConfirmationTemplate}
                  className="min-h-48 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  required
                />
                <FieldDescription>
                  Gunakan placeholder berikut agar isi pesan menyesuaikan data
                  booking user:
                </FieldDescription>
                <div className="flex flex-wrap gap-2">
                  {templatePlaceholders.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
                <FieldDescription>
                  Contoh: `ID transaksi: {"{id}"}` akan otomatis diganti dengan ID
                  transaksi booking user.
                </FieldDescription>
              </Field>
            </FieldGroup>

            <div className="flex justify-end">
              <Button type="submit">Simpan pengaturan</Button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Harga lapangan</h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Tarif ini dipakai di halaman booking, pembayaran, riwayat, dan
              dashboard.
            </p>
          </div>

          <form action={updateAppSettings} className="mt-6 space-y-5">
            <input
              type="hidden"
              name="adminWhatsappNumber"
              value={settings.adminWhatsappNumber}
            />
            <input
              type="hidden"
              name="whatsappConfirmationTemplate"
              value={settings.whatsappConfirmationTemplate}
            />
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="booking-hourly-rate">
                  Harga lapangan per jam
                </FieldLabel>
                <Input
                  id="booking-hourly-rate"
                  name="bookingHourlyRate"
                  type="number"
                  min={1}
                  step={1000}
                  defaultValue={settings.bookingHourlyRate}
                  required
                />
                <FieldDescription>
                  Harga aktif saat ini {formatBookingPrice(settings.bookingHourlyRate)}
                  {" "}per jam.
                </FieldDescription>
              </Field>
            </FieldGroup>

            <div className="flex justify-end">
              <Button type="submit">Simpan harga</Button>
            </div>
          </form>
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Admin aktif</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              User dengan role admin bisa mengakses dashboard admin dan seluruh
              pengaturannya.
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="lg">
                          <AvatarImage src={admin.image ?? undefined} alt={admin.name} />
                          <AvatarFallback>{getInitials(admin.name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{admin.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell className="text-right">
                      {session?.user?.id === admin.id ? (
                        <Badge variant="outline">Akun kamu</Badge>
                      ) : (
                        <form action={demoteAdminToUser}>
                          <input type="hidden" name="userId" value={admin.id} />
                          <Button type="submit" variant="outline">
                            Jadikan user biasa
                          </Button>
                        </form>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Tambah admin</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Cari user berdasarkan nama atau email, lalu ubah role-nya menjadi
              admin.
            </p>
          </div>

          <div className="mt-6">
            <AdminUserSearchInput key={query} defaultValue={query} />
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            {query ? (
              searchResults.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar size="lg">
                              <AvatarImage src={user.image ?? undefined} alt={user.name} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-right">
                          <form action={promoteUserToAdmin}>
                            <input type="hidden" name="userId" value={user.id} />
                            <Button type="submit">Jadikan admin</Button>
                          </form>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="p-4 text-sm text-muted-foreground">
                  Tidak ada user yang cocok dengan pencarian ini.
                </p>
              )
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                Masukkan nama atau email user terlebih dulu untuk mencari akun.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

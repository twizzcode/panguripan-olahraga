"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format, parse, startOfDay } from "date-fns";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { createBooking } from "@/app/(home)/jadwal-lapangan/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const startTimeOptions = Array.from({ length: 16 }, (_, index) => {
  const hour = index + 7;
  return `${String(hour).padStart(2, "0")}:00`;
});

const durationOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

export function BookingCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [scheduleConflictDialogOpen, setScheduleConflictDialogOpen] =
    useState(false);
  const [submissionErrorDialogOpen, setSubmissionErrorDialogOpen] =
    useState(false);
  const [startTimeMenuOpen, setStartTimeMenuOpen] = useState(false);
  const [durationMenuOpen, setDurationMenuOpen] = useState(false);
  const initialDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return today;
    }

    const parsedDate = parse(dateParam, "yyyy-MM-dd", new Date());

    if (Number.isNaN(parsedDate.getTime())) {
      return today;
    }

    parsedDate.setHours(0, 0, 0, 0);

    return parsedDate < today ? today : parsedDate;
  }, [searchParams]);

  const [formValues, setFormValues] = useState({
    name: "",
    institution: "",
    date: initialDate,
    startTime: "08:00",
    durationHours: "1",
    whatsapp: "",
  });

  const endTime = useMemo(() => {
    const [hours, minutes] = formValues.startTime.split(":").map(Number);
    const duration = Number(formValues.durationHours);
    const totalMinutes = (hours || 0) * 60 + (minutes || 0) + duration * 60;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
  }, [formValues.startTime, formValues.durationHours]);

  function handleChange(name: keyof typeof formValues, value: string) {
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const durationHours = Number(formValues.durationHours);
    const selectedDate = new Date(formValues.date);
    const [hours, minutes] = formValues.startTime.split(":").map(Number);
    const start = new Date(selectedDate);
    start.setHours(hours || 0, minutes || 0, 0, 0);

    if (
      !formValues.name.trim() ||
      !formValues.institution.trim() ||
      !formValues.whatsapp.trim() ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(durationHours) ||
      durationHours <= 0
    ) {
      setSubmissionErrorDialogOpen(true);
      return;
    }

    const result = await createBooking({
      name: formValues.name.trim(),
      institution: formValues.institution.trim(),
      whatsapp: formValues.whatsapp.trim(),
      start: start.toISOString(),
      durationHours,
    });

    if (result.ok) {
      setScheduleConflictDialogOpen(false);
      setSubmissionErrorDialogOpen(false);
      router.push(`/jadwal-lapangan/${result.booking.transactionId}`);
      return;
    }

    if ("reason" in result && result.reason === "conflict") {
        setScheduleConflictDialogOpen(true);
        return;
    }

    setSubmissionErrorDialogOpen(true);
  }

  return (
    <>
      <div className="w-full py-8 sm:py-10">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Pengajuan Jadwal Lapangan
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Isi detail pengajuan, lalu konfirmasi setelah data
            tersimpan.
          </p>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="booking-name">Nama pemesan</FieldLabel>
                  <Input
                    id="booking-name"
                    value={formValues.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    placeholder="Nama pemesan"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="booking-institution">Instansi</FieldLabel>
                  <Input
                    id="booking-institution"
                    value={formValues.institution}
                    onChange={(event) =>
                      handleChange("institution", event.target.value)
                    }
                    placeholder="Nama instansi"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>Tanggal</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between font-normal"
                      >
                        <span>{format(formValues.date, "dd MMMM yyyy")}</span>
                        <CalendarDays className="size-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formValues.date}
                        disabled={{ before: startOfDay(new Date()) }}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            setFormValues((current) => ({
                              ...current,
                              date: selectedDate,
                            }));
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>

                <Field>
                  <FieldLabel>Jam mulai</FieldLabel>
                  <DropdownMenu
                    open={startTimeMenuOpen}
                    onOpenChange={(open) => {
                      setStartTimeMenuOpen(open);
                      if (open) {
                        setDurationMenuOpen(false);
                      }
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between font-normal"
                      >
                        <span>{formValues.startTime}</span>
                        <ChevronDown className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[var(--radix-dropdown-menu-trigger-width)]"
                    >
                      {startTimeOptions.map((time) => (
                        <DropdownMenuItem
                          key={time}
                          onSelect={() => handleChange("startTime", time)}
                        >
                          {time}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Field>

                <Field>
                  <FieldLabel>Durasi</FieldLabel>
                  <DropdownMenu
                    open={durationMenuOpen}
                    onOpenChange={(open) => {
                      setDurationMenuOpen(open);
                      if (open) {
                        setStartTimeMenuOpen(false);
                      }
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between font-normal"
                      >
                        <span>{formValues.durationHours} jam</span>
                        <ChevronDown className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-[var(--radix-dropdown-menu-trigger-width)]"
                    >
                      {durationOptions.map((duration) => (
                        <DropdownMenuItem
                          key={duration}
                          onSelect={() => handleChange("durationHours", duration)}
                        >
                          {duration} jam
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Field>

                <Field>
                  <FieldLabel htmlFor="booking-whatsapp">
                    Nomor WhatsApp
                  </FieldLabel>
                  <Input
                    id="booking-whatsapp"
                    type="tel"
                    value={formValues.whatsapp}
                    onChange={(event) =>
                      handleChange("whatsapp", event.target.value)
                    }
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </Field>
              </FieldGroup>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" className="bg-brand text-background">
                  Ajukan Jadwal
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/jadwal-lapangan">Kembali ke kalender</Link>
                </Button>
              </div>
            </form>
          </div>

          <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total durasi</p>
                <p className="text-3xl font-semibold text-foreground">
                  {formValues.durationHours} Jam
                </p>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Tanggal</span>
                  <span className="font-medium text-foreground">
                    {format(formValues.date, "dd MMM yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Jam mulai</span>
                  <span className="font-medium text-foreground">
                    {formValues.startTime}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Jam selesai</span>
                  <span className="font-medium text-foreground">
                    {endTime}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>

      </div>

      <AlertDialog
        open={scheduleConflictDialogOpen}
        onOpenChange={setScheduleConflictDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Jadwal sudah terisi</AlertDialogTitle>
            <AlertDialogDescription>
              Tanggal dan jam yang dipilih bentrok dengan jadwal lain. Pilih
              jam atau tanggal yang berbeda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setScheduleConflictDialogOpen(false)}
            >
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={submissionErrorDialogOpen}
        onOpenChange={setSubmissionErrorDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Booking gagal disimpan</AlertDialogTitle>
            <AlertDialogDescription>
              Ada masalah saat menyimpan booking. Coba login ulang atau periksa
              kembali data yang diisi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setSubmissionErrorDialogOpen(false)}
            >
              Tutup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

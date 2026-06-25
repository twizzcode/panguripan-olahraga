"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function BookingFilters({
  tab,
  query,
  date,
}: {
  tab: string;
  query: string;
  date: string;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    date ? parseISO(date) : undefined
  );

  return (
    <form className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
      <input type="hidden" name="tab" value={tab} />
      <input
        type="hidden"
        name="date"
        value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
      />
      <Input
        name="q"
        defaultValue={query}
        placeholder="Cari ID transaksi, nama, instansi, atau WhatsApp"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between font-normal sm:max-w-56"
          >
            <span>
              {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Pilih tanggal"}
            </span>
            <CalendarDays className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
          <div className="flex justify-end border-t border-border p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(undefined)}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      <Button type="submit" variant="outline">
        Search
      </Button>
    </form>
  );
}

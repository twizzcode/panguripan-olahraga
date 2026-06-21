"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

export function AdminUserSearchInput({
  defaultValue,
}: {
  defaultValue: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const deferredValue = useDeferredValue(value);

  useEffect(() => {
    const nextValue = deferredValue.trim();
    const currentValue = searchParams.get("q")?.trim() ?? "";

    if (nextValue === currentValue) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (nextValue) {
      params.set("q", nextValue);
    } else {
      params.delete("q");
    }

    const nextUrl = params.size ? `${pathname}?${params.toString()}` : pathname;

    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [deferredValue, pathname, router, searchParams]);

  return (
    <Input
      name="q"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="Cari nama atau email user"
    />
  );
}

"use client";

import Link from "next/link";
import {
  IconBrandInstagram,
  IconHeartFilled,
} from "@tabler/icons-react";

import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/site-config";
import Image from "next/image";

const infoLinks = [
  { label: "Halaman Utama", href: "/" },
  { label: "Jadwal Lapangan", href: "/jadwal-lapangan" },
  { label: "Klinik Pelatih", href: "/klinik-pelatih" },
  { label: "Riwayat Jadwal", href: "/riwayat-booking" },
];

export function SiteFooter() {
  return (
    <footer className="w-full mt-12 sm:mt-16 bg-brand text-brand-foreground">
      <Separator className="mb-12 sm:mb-16 bg-brand-foreground/20" />
      <div className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6 sm:pb-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl text-brand">
                <Image 
                  src="/logo.png" 
                  alt={siteConfig.name}
                  width={56}
                  height={56}
                  className="h-14 w-auto"
                />
              </div>
              <span className="text-lg font-semibold tracking-tight sm:text-xl">
                {siteConfig.name}
              </span>
            </div>

            <p className="max-w-md text-sm leading-7 text-brand-foreground/70 sm:text-base">
              {siteConfig.description}
            </p>

            <a
              href="#"
              aria-label="Instagram"
              className="inline-flex items-center gap-2 text-sm text-brand-foreground/70 transition-colors hover:text-brand-foreground"
            >
              <IconBrandInstagram className="size-5" />
              @pkm.panguripanolahraga
            </a>
          </div>

          <div className="lg:flex lg:justify-center">
            <FooterLinkColumn title="Navigasi" links={infoLinks} />
          </div>
        </div>

        <div className="mt-12 w-full py-6 text-xs text-brand-foreground/70 sm:mt-16 sm:text-sm">
          <Separator className="mb-6 bg-brand-foreground/20" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold text-brand-foreground">{siteConfig.name}</span>{" "}
              &copy; All rights reserved.
            </p>
            <p className="flex items-center gap-1">
              Made with
              <IconHeartFilled className="size-4 text-red-500" />
              by
              <a href="#" className="font-medium text-brand-foreground">
                @pkm.panguripanolahraga
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h3>
      <div className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm text-brand-foreground/70 transition-colors hover:text-brand-foreground sm:text-base"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

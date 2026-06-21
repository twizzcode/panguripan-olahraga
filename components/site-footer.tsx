"use client";

import Link from "next/link";
import {
  IconBrandInstagram,
  IconHeartFilled,
} from "@tabler/icons-react";

import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/site-config";

const infoLinks = [
  { label: "Home", href: "/" },
  { label: "Booking", href: "/booking" },
  { label: "Pelatihan", href: "/pelatihan" },
  { label: "Riwayat booking", href: "/riwayat-booking" },
];

export function SiteFooter() {
  return (
    <footer className="w-full pt-12 sm:pt-16">
      <Separator className="mb-12 sm:mb-16" />
      <div className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6 sm:pb-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
                <span className="text-sm font-semibold">P</span>
              </div>
              <span className="text-lg font-semibold tracking-tight sm:text-xl">
                {siteConfig.name}
              </span>
            </div>

            <p className="max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
              {siteConfig.description}
            </p>

            <a
              href="#"
              aria-label="Instagram"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <IconBrandInstagram className="size-5" />
              Instagram
            </a>
          </div>

          <div className="lg:flex lg:justify-center">
            <FooterLinkColumn title="Navigasi" links={infoLinks} />
          </div>
        </div>

        <div className="mt-12 w-full py-6 text-xs text-muted-foreground sm:mt-16 sm:text-sm">
          <Separator className="mb-6" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold text-foreground">{siteConfig.name}</span>{" "}
              &copy; All rights reserved.
            </p>
            <p className="flex items-center gap-1">
              Made with
              <IconHeartFilled className="size-4 text-red-500" />
              by
              <a href="#" className="font-medium text-foreground">
                @ausrobdev
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
            className="text-sm text-muted-foreground transition-colors hover:text-foreground sm:text-base"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

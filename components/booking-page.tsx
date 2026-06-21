"use client"

import { useState } from "react"
import {
  IconChartBar,
  IconClockHour4,
  IconDatabase,
  IconLayersIntersect,
  IconSparkles,
} from "@tabler/icons-react"
import { motion } from "motion/react"

import CalendarDemo from "@/components/calendar-demo"
import { CalendarEvent } from "@/components/calendar/calendar-types"
import {
  parseSerializedCalendarEvent,
  type SerializedCalendarEvent,
} from "@/lib/booking-events"

const featureTabs = [
  { label: "Insights", icon: IconSparkles },
  { label: "Metrics", icon: IconChartBar },
  { label: "Trends", icon: IconClockHour4 },
  { label: "Sources", icon: IconDatabase },
  { label: "Models", icon: IconLayersIntersect },
]

export function BookingPage({
  initialEvents,
}: {
  initialEvents: SerializedCalendarEvent[]
}) {
  const [activeTab, setActiveTab] = useState(featureTabs[0].label)
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    initialEvents.map(parseSerializedCalendarEvent)
  )

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <section className="px-4 pt-8 text-center sm:px-6 sm:pt-12 lg:px-10 lg:pt-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              The AI-powered CRM solution.
            </h1>
            <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Let AI help you manage accounts, deals, and handoffs in one
              place. Experience the future of CRM with AI-powered insights and
              automation.
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-center sm:mt-14">
          <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-border/70 bg-muted/50 p-1.5 shadow-sm">
            {featureTabs.map(({ label, icon: Icon }) => {
              const isActive = activeTab === label

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveTab(label)}
                  className={[
                    "relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm transition-colors sm:px-4",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="booking-feature-tab"
                      className="absolute inset-0 rounded-xl bg-background shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  ) : null}
                  <Icon className="relative z-10 size-4" />
                  <span className="relative z-10">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <CalendarDemo events={events} setEvents={setEvents} />
      </div>
    </div>
  )
}

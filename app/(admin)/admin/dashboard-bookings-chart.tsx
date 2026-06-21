"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  total: {
    label: "Booking",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export function DashboardBookingsChart({
  data,
}: {
  data: Array<{
    month: string;
    total: number;
  }>;
}) {
  return (
    <ChartContainer config={chartConfig} className="min-h-72 w-full">
      <BarChart accessibilityLayer data={data} margin={{ left: 4, right: 4 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={12}
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar
          dataKey="total"
          fill="var(--color-total)"
          radius={[10, 10, 0, 0]}
          maxBarSize={42}
        />
      </BarChart>
    </ChartContainer>
  );
}

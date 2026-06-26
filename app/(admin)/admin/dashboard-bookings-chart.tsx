"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <ChartContainer config={chartConfig} className="h-56 w-full sm:h-64">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          top: 4,
          right: isMobile ? 0 : 4,
          left: isMobile ? -20 : 4,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={isMobile ? 8 : 12}
          interval={isMobile ? 1 : 0}
          minTickGap={isMobile ? 24 : 12}
          fontSize={12}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          width={isMobile ? 24 : 32}
          fontSize={12}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar
          dataKey="total"
          fill="var(--color-total)"
          radius={[10, 10, 0, 0]}
          maxBarSize={isMobile ? 24 : 42}
        />
      </BarChart>
    </ChartContainer>
  );
}

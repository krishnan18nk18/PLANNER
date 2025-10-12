'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Task } from '@/lib/types';

type ProgressChartProps = {
  tasks: Task[];
};

export function ProgressChart({ tasks }: ProgressChartProps) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const chartData = [
    { name: 'Pending', count: pendingCount, fill: 'var(--color-chart-2)' },
    { name: 'Completed', count: completedCount, fill: 'var(--color-chart-1)' },
  ];

  const chartConfig = {
    count: {
      label: 'Tasks',
    },
    pending: {
      label: 'Pending',
      color: 'hsl(var(--chart-2))',
    },
    completed: {
      label: 'Completed',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <Tooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}

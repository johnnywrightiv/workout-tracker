'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface Workout {
  date: string;
  duration: number;
}

export default function WorkoutDuration({ workouts }: { workouts: Workout[] }) {
  const data = workouts
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((workout) => ({
      date: new Date(workout.date).toLocaleDateString(),
      duration: workout.duration,
    }));

  return (
    <ChartContainer
      config={{
        duration: {
          label: 'Duration (minutes)',
          color: 'hsl(var(--primary))',
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis dataKey="date" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="duration"
            stroke="var(--color-duration)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

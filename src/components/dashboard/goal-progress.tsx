'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';

const data = [
  { name: 'Completed', value: 25 },
  { name: 'Remaining', value: 75 },
];
const LIGHT_COLORS = ['#007AFF', '#0000001A'];
const DARK_COLORS = ['#007AFF', '#FFFFFF30'];

export function GoalProgress() {
  const { theme } = useTheme();
  const percentage = data[0].value;
  const colors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  return (
    <Card className="glass-card text-card-foreground border-border/20">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Goal</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative h-32 w-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                startAngle={90}
                endAngle={450}
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{`${percentage}%`}</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Till 10:00A.M</p>
      </CardContent>
    </Card>
  );
}

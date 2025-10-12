'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Task } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useTheme } from 'next-themes';
import { CheckCircle, ListTodo, AlertTriangle, Clock } from 'lucide-react';
import { useMemo } from 'react';

const LIGHT_COLORS = {
  completed: '#34C759',
  pending: '#007AFF',
  overdue: '#FF3B30',
  onTrack: '#FF9500',
  background: '#0000001A'
};

const DARK_COLORS = {
  completed: '#34C759',
  pending: '#007AFF',
  overdue: '#FF3B30',
  onTrack: '#FF9500',
  background: '#FFFFFF30'
};

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: React.ElementType, color: string }) => (
    <div className="glass-card rounded-2xl p-4 text-card-foreground border-border/20 flex items-center gap-4 animate-fade-in hover:scale-105 transition-transform">
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}30`}}>
            <Icon className="h-6 w-6" style={{ color }} />
        </div>
        <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
        </div>
    </div>
);


const CompletionRing = ({ percentage, color, label }: { percentage: number, color: string, label: string }) => {
    const { theme } = useTheme();
    const colors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
    const data = [{ name: 'completed', value: percentage }, { name: 'remaining', value: 100 - percentage }];
  
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-28 w-28">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={45} startAngle={90} endAngle={450} paddingAngle={0} dataKey="value">
                    <Cell fill={color} stroke="none" />
                    <Cell fill={colors.background} stroke="none" />
                </Pie>
            </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{`${percentage}%`}</span>
            </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    );
};

export function TaskAnalytics({ tasks }: { tasks: Task[] }) {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    const overdue = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;
    const onTrack = pending - overdue;
    const total = tasks.length;

    return {
      completed,
      pending,
      overdue,
      onTrack,
      total,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      overduePercentage: pending > 0 ? Math.round((overdue / pending) * 100) : 0,
      onTrackPercentage: pending > 0 ? Math.round((onTrack / pending) * 100) : 0,
    };
  }, [tasks]);

  return (
    <Card className="glass-card text-card-foreground border-border/20">
        <CardHeader>
            <CardTitle className="font-headline text-xl">Task Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Tasks Completed" value={stats.completed} icon={CheckCircle} color={colors.completed} />
                <StatCard title="Pending Tasks" value={stats.pending} icon={ListTodo} color={colors.pending} />
                <StatCard title="On Track" value={stats.onTrack} icon={Clock} color={colors.onTrack} />
                <StatCard title="Overdue Tasks" value={stats.overdue} icon={AlertTriangle} color={colors.overdue} />
            </div>
             <div className="flex flex-col md:flex-row items-center justify-around gap-6 pt-4">
                <CompletionRing percentage={stats.completionPercentage} color={colors.completed} label="Overall Completion" />
                <CompletionRing percentage={stats.onTrackPercentage} color={colors.onTrack} label="Pending On Track" />
                <CompletionRing percentage={stats.overduePercentage} color={colors.overdue} label="Pending Overdue" />
            </div>
        </CardContent>
    </Card>
  );
}

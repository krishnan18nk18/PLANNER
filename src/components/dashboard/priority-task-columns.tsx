'use client';

import type { Task } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

type PriorityTaskColumnsProps = {
    highPriorityTasks: Task[];
    mediumPriorityTasks: Task[];
    lowPriorityTasks: Task[];
}

const TaskCard = ({ task }: { task: Task }) => (
    <div className="glass-card rounded-2xl p-4 text-card-foreground border-border/20 mb-4 hover:scale-105 transition-transform animate-fade-in animate-bounce-hover">
        <div className="flex justify-between items-start">
            <p className="font-semibold text-base">{task.title}</p>
            <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer" />
        </div>
        <p className="text-sm text-muted-foreground">{formatDate(task.dueDate)}</p>
    </div>
);


const PriorityColumn = ({ title, tasks, gradient }: { title: string, tasks: Task[], gradient: string }) => (
    <Card className={cn("glass-card text-card-foreground border-border/20", gradient)}>
        <CardHeader>
            <CardTitle className="font-headline text-lg text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        </CardContent>
    </Card>
)

export function PriorityTaskColumns({ highPriorityTasks, mediumPriorityTasks, lowPriorityTasks }: PriorityTaskColumnsProps) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PriorityColumn title="High Priority" tasks={highPriorityTasks} gradient="dark:bg-gradient-to-b dark:from-red-500/30 dark:to-orange-500/30" />
            <PriorityColumn title="Medium Priority" tasks={mediumPriorityTasks} gradient="dark:bg-gradient-to-b dark:from-yellow-500/30 dark:to-orange-500/30" />
            <PriorityColumn title="Low Priority" tasks={lowPriorityTasks} gradient="dark:bg-gradient-to-b dark:from-blue-500/30 dark:to-purple-500/30" />
        </div>
    )
}

'use client';

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import type { Task } from "@/lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Check, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const priorityBadge = {
    High: 'destructive',
    Medium: 'secondary',
    Low: 'outline',
} as const;

export function LiveActivities({ tasks }: { tasks: Task[] }) {
    
    return (
        <Card className="glass-card text-card-foreground border-border/20">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Live & Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
                <Carousel opts={{
                    align: "start",
                }}
                className="w-full">
                    <CarouselContent>
                        {tasks.filter(t => !t.completed).map((task, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <div className="p-4 rounded-2xl glass-card border-border/20">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-lg">{task.title}</p>
                                            <Badge variant={priorityBadge[task.priority]}>{task.priority}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                                        <div className="flex items-center justify-end gap-2 mt-4">
                                            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 hover:bg-white/30"><Check className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 hover:bg-white/30"><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 hover:bg-destructive/30 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </CardContent>
        </Card>
    )
}

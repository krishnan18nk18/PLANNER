'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Plus, Pin } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const initialNotes = [
  { id: 'note-1', content: 'Design meeting tomorrow at 10 AM. Prepare wireframes.', color: 'from-yellow-400 to-orange-400', priority: 'High' },
  { id: 'note-2', content: 'Pick up groceries on the way home.', color: 'from-blue-400 to-purple-400', priority: 'Medium' },
  { id: 'note-3', content: 'Call the vet to schedule appointment for Sparky.', color: 'from-pink-400 to-red-400', priority: 'High' },
  { id: 'note-4', content: 'Q4 budget planning session - Friday.', color: 'from-green-400 to-teal-400', priority: 'Low' },
];

type Note = typeof initialNotes[0];

function SortableNote({ note }: { note: Note }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NoteCard note={note} isDragging={isDragging} />
    </div>
  );
}

function NoteCard({ note, isDragging }: { note: Note; isDragging?: boolean }) {
  const priorityBadge = {
    High: 'destructive',
    Medium: 'secondary',
    Low: 'outline',
  } as const;

  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-4 text-white shadow-xl transition-all duration-300 transform animate-float cursor-grab',
        'border-border/20',
        note.color,
        isDragging ? 'scale-105 shadow-2xl ring-4 ring-primary' : 'hover:scale-105 hover:shadow-2xl'
      )}
    >
        <div className="flex justify-between items-start">
            <Pin className="h-5 w-5 text-white/70" />
            <Badge variant={priorityBadge[note.priority as keyof typeof priorityBadge]}>{note.priority}</Badge>
        </div>
        <p className="mt-2 text-sm font-medium">{note.content}</p>
    </div>
  );
}

export function FloatingNotes() {
  const [notes, setNotes] = useState(initialNotes);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragStart(event: any) {
    setActiveNote(notes.find((n) => n.id === event.active.id) || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveNote(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setNotes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  
  return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SortableContext items={notes} strategy={rectSortingStrategy}>
            {notes.map((note, i) => (
                <SortableNote key={note.id} note={note} />
            ))}
            </SortableContext>
            <Button variant="ghost" className="h-full min-h-[100px] w-full border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground animate-bounce-hover">
                <Plus className="h-8 w-8" />
                <span>Add Note</span>
            </Button>
        </div>
        {typeof document !== 'undefined' && createPortal(
            <DragOverlay>
                {activeNote ? <NoteCard note={activeNote} isDragging /> : null}
            </DragOverlay>,
            document.body
        )}
      </DndContext>
  );
}

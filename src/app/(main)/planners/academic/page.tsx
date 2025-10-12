'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, BookOpen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Loader2 } from 'lucide-react';

const initialPlannerState = {
  timetable: Array.from({ length: 5 }, () => Array(8).fill('')),
  assignments: [
    { id: 1, title: 'History Essay', priority: 'High', status: 'Todo', completed: false },
    { id: 2, title: 'Math Problem Set', priority: 'Medium', status: 'In-Progress', completed: false },
  ],
  grades: [
    { id: 1, subject: 'History', assignment: 'Essay 1', grade: 'A-' },
    { id: 2, subject: 'Math', assignment: 'Problem Set 1', grade: 'B+' },
  ],
};


export default function AcademicPlannerPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const { db } = useFirestore();

  const plannerPath = user ? `users/${user.uid}/planners/academic` : null;
  const { data: plannerData, loading } = useDoc<typeof initialPlannerState>(plannerPath);

  const plannerState = plannerData || initialPlannerState;

  const handleSave = () => {
    if (!db || !user) return;
    const docRef = doc(db, plannerPath!);
    setDoc(docRef, plannerState, { merge: true })
      .then(() => {
        toast({
          title: 'Academic Planner Saved!',
          description: 'Your academic schedule and progress have been saved.',
        });
      })
      .catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({path: docRef.path, operation: 'write', requestResourceData: plannerState}));
      });
  };

  const updatePlanner = (data: Partial<typeof initialPlannerState>) => {
     if (!db || !user) return;
    const docRef = doc(db, plannerPath!);
    setDoc(docRef, data, { merge: true })
      .catch((err) => {
         errorEmitter.emit('permission-error', new FirestorePermissionError({path: docRef.path, operation: 'write', requestResourceData: data}));
      });
  };
  
  const addAssignment = () => {
    updatePlanner({ assignments: [...plannerState.assignments, { id: Date.now(), title: 'New Assignment', priority: 'Medium', status: 'Todo', completed: false }]});
  };

  const removeAssignment = (id: number) => {
    updatePlanner({ assignments: plannerState.assignments.filter(a => a.id !== id) });
  };
  
  const addGrade = () => {
    updatePlanner({ grades: [...plannerState.grades, { id: Date.now(), subject: 'New Subject', assignment: 'New Assignment', grade: 'A' }]});
  };

  const removeGrade = (id: number) => {
    updatePlanner({ grades: plannerState.grades.filter(g => g.id !== id) });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin" /></div>
  }

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Academic Planner
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Class Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-1 text-center text-xs">
                <div></div>
                <div className="font-bold">Mon</div>
                <div className="font-bold">Tue</div>
                <div className="font-bold">Wed</div>
                <div className="font-bold">Thu</div>
                <div className="font-bold">Fri</div>
                {plannerState.timetable.flatMap((row, rowIndex) => [
                    <div key={`time-${rowIndex}`} className="font-bold text-right pr-2">{`${rowIndex + 9}:00`}</div>,
                    ...row.slice(0,5).map((cell, colIndex) => (
                        <Input 
                            key={`${rowIndex}-${colIndex}`}
                            value={cell}
                            onChange={(e) => {
                                const newTimetable = [...plannerState.timetable];
                                newTimetable[rowIndex][colIndex] = e.target.value;
                                updatePlanner({ timetable: newTimetable });
                            }}
                            className="h-10 text-xs p-1"
                            placeholder="Class"
                        />
                    ))
                ])}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Assignment Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {plannerState.assignments.map(assignment => (
                <div key={assignment.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/10">
                  <Checkbox checked={assignment.completed} onCheckedChange={(checked) => updatePlanner({ assignments: plannerState.assignments.map(a => a.id === assignment.id ? {...a, completed: !!checked} : a)})} />
                  <Input 
                    value={assignment.title} 
                    onChange={(e) => updatePlanner({ assignments: plannerState.assignments.map(a => a.id === assignment.id ? {...a, title: e.target.value} : a)})}
                    className="flex-grow bg-transparent border-none focus-visible:ring-0"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeAssignment(assignment.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={addAssignment} className="mt-4 w-full">Add Assignment</Button>
          </CardContent>
        </Card>
      </div>

       <Card className="glass-card">
          <CardHeader>
            <CardTitle>Grade Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 font-bold text-sm">
                <div>Subject</div>
                <div>Assignment</div>
                <div>Grade</div>
                <div>Actions</div>
              </div>
              {plannerState.grades.map(grade => (
                <div key={grade.id} className="grid grid-cols-4 items-center gap-2 p-2 rounded-lg bg-white/10">
                  <Input value={grade.subject} onChange={(e) => updatePlanner({grades: plannerState.grades.map(g => g.id === grade.id ? {...g, subject: e.target.value} : g)})} className="bg-transparent border-none" />
                  <Input value={grade.assignment} onChange={(e) => updatePlanner({grades: plannerState.grades.map(g => g.id === grade.id ? {...g, assignment: e.target.value} : g)})} className="bg-transparent border-none" />
                  <Input value={grade.grade} onChange={(e) => updatePlanner({grades: plannerState.grades.map(g => g.id === grade.id ? {...g, grade: e.target.value} : g)})} className="bg-transparent border-none" />
                  <Button variant="ghost" size="icon" onClick={() => removeGrade(grade.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button onClick={addGrade} className="mt-4 w-full">Add Grade</Button>
          </CardContent>
        </Card>

      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="rounded-full w-24 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-110 transition-transform shadow-lg">
          Save
        </Button>
      </div>
    </div>
  );
}

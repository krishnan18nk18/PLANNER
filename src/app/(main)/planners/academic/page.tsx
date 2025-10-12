'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, BookOpen, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';

const initialTimetable = Array.from({ length: 5 }, () => Array(8).fill(''));
const initialAssignments = [
  { id: 1, title: 'History Essay', priority: 'High', status: 'Todo', completed: false },
  { id: 2, title: 'Math Problem Set', priority: 'Medium', status: 'In-Progress', completed: false },
];
const initialGrades = [
  { id: 1, subject: 'History', assignment: 'Essay 1', grade: 'A-' },
  { id: 2, subject: 'Math', assignment: 'Problem Set 1', grade: 'B+' },
];


export default function AcademicPlannerPage() {
  const { toast } = useToast();
  const [timetable, setTimetable] = useLocalStorageState('academicPlanner_timetable', initialTimetable);
  const [assignments, setAssignments] = useLocalStorageState('academicPlanner_assignments', initialAssignments);
  const [grades, setGrades] = useLocalStorageState('academicPlanner_grades', initialGrades);

  const handleSave = () => {
    // Data is already saved by the hook. This is just for user feedback.
    toast({
      title: 'Academic Planner Saved!',
      description: 'Your academic schedule and progress have been saved.',
    });
  };
  
  const addAssignment = () => {
    setAssignments([...assignments, { id: Date.now(), title: 'New Assignment', priority: 'Medium', status: 'Todo', completed: false }]);
  };

  const removeAssignment = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };
  
  const addGrade = () => {
    setGrades([...grades, { id: Date.now(), subject: 'New Subject', assignment: 'New Assignment', grade: 'A' }]);
  };

  const removeGrade = (id: number) => {
    setGrades(grades.filter(g => g.id !== id));
  };

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
                {timetable.flatMap((row, rowIndex) => [
                    <div key={`time-${rowIndex}`} className="font-bold text-right pr-2">{`${rowIndex + 9}:00`}</div>,
                    ...row.slice(0,5).map((cell, colIndex) => (
                        <Input 
                            key={`${rowIndex}-${colIndex}`}
                            value={cell}
                            onChange={(e) => {
                                const newTimetable = [...timetable];
                                newTimetable[rowIndex][colIndex] = e.target.value;
                                setTimetable(newTimetable);
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
              {assignments.map(assignment => (
                <div key={assignment.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/10">
                  <Checkbox checked={assignment.completed} onCheckedChange={(checked) => setAssignments(assignments.map(a => a.id === assignment.id ? {...a, completed: !!checked} : a))} />
                  <Input 
                    value={assignment.title} 
                    onChange={(e) => setAssignments(assignments.map(a => a.id === assignment.id ? {...a, title: e.target.value} : a))}
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
              {grades.map(grade => (
                <div key={grade.id} className="grid grid-cols-4 items-center gap-2 p-2 rounded-lg bg-white/10">
                  <Input value={grade.subject} onChange={(e) => setGrades(grades.map(g => g.id === grade.id ? {...g, subject: e.target.value} : g))} className="bg-transparent border-none" />
                  <Input value={grade.assignment} onChange={(e) => setGrades(grades.map(g => g.id === grade.id ? {...g, assignment: e.target.value} : g))} className="bg-transparent border-none" />
                  <Input value={grade.grade} onChange={(e) => setGrades(grades.map(g => g.id === grade.id ? {...g, grade: e.target.value} : g))} className="bg-transparent border-none" />
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

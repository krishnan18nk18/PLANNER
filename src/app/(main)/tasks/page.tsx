
'use client';

import { TaskManager } from '@/components/tasks/task-manager';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Task } from '@/lib/types';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function TasksPage() {
  const { user } = useUser();
  const { db } = useFirestore();

  const { data: tasks, loading } = useCollection<Task>(
    user ? `users/${user.uid}/tasks` : null
  );

  const setTasks = async (newTasks: Task[] | ((prev: Task[]) => Task[])) => {
    if (!db || !user) return;
    const taskCollection = collection(db, 'users', user.uid, 'tasks');

    const updatedTasks = typeof newTasks === 'function' ? newTasks(tasks || []) : newTasks;
    
    // This is a simplified diffing. For a real app, a more robust solution is needed.
    // Adds or updates
    for (const task of updatedTasks) {
        if (!tasks?.find(t => t.id === task.id)) { // It's a new task
            addDoc(collection(db, `users/${user.uid}/tasks`), { ...task, id: undefined })
                .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({path: `users/${user.uid}/tasks`, operation: 'create', requestResourceData: task})));
        } else { // It's an existing task, check for changes
            const originalTask = tasks.find(t => t.id === task.id);
            if (JSON.stringify(originalTask) !== JSON.stringify(task)) {
                const docRef = doc(db, 'users', user.uid, 'tasks', task.id);
                updateDoc(docRef, task)
                 .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({path: docRef.path, operation: 'update', requestResourceData: task})));
            }
        }
    }
    // Deletes
    if (tasks) {
        for (const oldTask of tasks) {
            if (!updatedTasks.find(t => t.id === oldTask.id)) {
                const docRef = doc(db, 'users', user.uid, 'tasks', oldTask.id);
                deleteDoc(docRef)
                 .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({path: docRef.path, operation: 'delete'})));
            }
        }
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin" /></div>
  }

  return (
    <div className="animate-fade-in">
      <div className="space-y-1 mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">My Task Journey</h1>
        <p className="text-muted-foreground">
            Scroll through your tasks like a map, from start to finish.
        </p>
      </div>
      <TaskManager initialTasks={tasks || []} setTasks={setTasks} />
    </div>
  );
}

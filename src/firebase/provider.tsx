// src/firebase/provider.tsx
'use client';
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { errorEmitter } from './error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from './errors';

export type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
} | null;

const FirebaseContext = createContext<FirebaseServices>(null);

export function FirebaseProvider({
  children,
  services,
}: {
  children: ReactNode;
  services: FirebaseServices;
}) {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error(error); // Also log the full error to the console for debugging
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: `Your request was denied by security rules. Check console for details. Path: ${error.context.path}`,
        duration: 10000,
      });
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return (
    <FirebaseContext.Provider value={services}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
export const useFirebaseApp = () => useFirebase()?.app ?? null;
export const useAuth = () => ({ auth: useFirebase()?.auth ?? null });
export const useFirestore = () => ({ db: useFirebase()?.db ?? null });

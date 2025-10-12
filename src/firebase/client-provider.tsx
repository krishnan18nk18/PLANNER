// src/firebase/client-provider.tsx
'use client';
import { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider, type FirebaseServices } from './provider';
import { initializeFirebase } from '.';
import { FirebaseApp } from 'firebase/app';
import { Auth, getAuth, connectAuthEmulator } from 'firebase/auth';
import {
  Firestore,
  getFirestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebase, setFirebase] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    const services = initializeFirebase();
    setFirebase(services);
  }, []);

  return <FirebaseProvider services={firebase}>{children}</FirebaseProvider>;
}

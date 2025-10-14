
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { db } = useFirestore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user && db) {
        // Create user profile if it doesn't exist
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
        }, { merge: true });
      }
      toast({ title: 'Successfully signed in with Google!' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
    }
  };
  
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Successfully signed in!' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-In Failed',
        description: error.message,
      });
    }
  };

  const handleTestUserSignIn = async () => {
    const auth = getAuth();
    const testEmail = 'test@example.com';
    const testPassword = 'password123';

    try {
      // First, try to sign in
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
      toast({ title: 'Signed in as Test User!' });
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        // If user doesn't exist, create it
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
          const user = userCredential.user;
          if (user && db) {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: 'Test User',
              photoURL: '',
              createdAt: new Date().toISOString(),
            });
          }
          toast({ title: 'Test User account created and signed in!' });
          router.push('/dashboard');
        } catch (creationError: any) {
          toast({
            variant: 'destructive',
            title: 'Test User Creation Failed',
            description: creationError.message,
          });
        }
      } else {
        // Handle other sign-in errors
        toast({
          variant: 'destructive',
          title: 'Test User Sign-In Failed',
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline flex items-center justify-center gap-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            Welcome to PlanVerse
          </CardTitle>
          <CardDescription>Sign in to continue to your planner</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">Sign In</Button>
          </form>
          <Button variant="secondary" onClick={handleTestUserSignIn} className="w-full mt-2">
            Sign in as Test User
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
             <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.62-3.96 1.62-3.36 0-6.09-2.73-6.09-6.09s2.73-6.09 6.09-6.09c1.85 0 3.18.75 4.13 1.65l2.7-2.7C18.6 1.7 16.13 0 12.48 0 5.88 0 .52 5.36.52 12s5.36 12 11.96 12c3.42 0 6.17-1.17 8.2-3.25 2.1-2.08 2.8-5.04 2.8-7.98 0-.65-.05-1.3-.15-1.95H12.48z"></path></svg>
            Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/auth-slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { RootState } from '@/store/store';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    if (isAuthenticated && isSigningUp) {
      router.push('/');
    }
  }, [isAuthenticated, isSigningUp, router]);

  const validatePassword = (
    password: string,
  ): { isValid: boolean; message: string } => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long',
      };
    }
    if (!hasUpperCase) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter',
      };
    }
    if (!hasLowerCase) {
      return {
        isValid: false,
        message: 'Password must contain at least one lowercase letter',
      };
    }
    if (!hasNumbers) {
      return {
        isValid: false,
        message: 'Password must contain at least one number',
      };
    }
    if (!hasSpecialChar) {
      return {
        isValid: false,
        message: 'Password must contain at least one special character',
      };
    }

    return { isValid: true, message: '' };
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);

    // Basic validation
    if (!email || !password || !confirmPassword || !name) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      setIsSigningUp(false);
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      setIsSigningUp(false);
      return;
    }

    // Password strength validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        title: 'Error',
        description: passwordValidation.message,
        variant: 'destructive',
      });
      setIsSigningUp(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Account created successfully',
        });
        dispatch(
          login({
            userId: data.userId,
            email: data.email,
            name: data.name,
          }),
        );
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to create account',
          variant: 'destructive',
        });
        setIsSigningUp(false);
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsSigningUp(false);
    }
  };

  return (
    <div className="bg-background mt-12 flex justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="First Last"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSigningUp}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSigningUp}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSigningUp}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSigningUp}
              />
            </div>
            <div className="text-muted-foreground text-sm">
              Password must contain at least:
              <ul className="mt-1 list-inside list-disc">
                <li>8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </CardFooter>
          <div className="mb-4 flex items-center justify-center text-sm">
            Already have an account?
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 ml-2"
            >
              Log In
            </Link>
          </div>
        </form>
      </Card>
      <Toaster />
    </div>
  );
};

export default Signup;

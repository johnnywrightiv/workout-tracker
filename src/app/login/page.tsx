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

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();
	const { toast } = useToast();
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);

	useEffect(() => {
		if (isAuthenticated && isLoggingIn) {
			router.push('/');
		}
	}, [isAuthenticated, isLoggingIn, router]);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoggingIn(true);

		if (!email || !password) {
			toast({
				title: 'Error',
				description: 'Please fill in all fields',
				variant: 'destructive',
			});
			setIsLoggingIn(false);
			return;
		}

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Login successful',
				});
				// Updated to match the API response structure
				dispatch(
					login({
						userId: data.user.userId,
						email: data.user.email,
						name: data.user.name,
						preferences: data.user.preferences,
					})
				);
			} else {
				console.error('Login failed:', data.message || 'Unknown error');
				toast({
					title: 'Error',
					description: data.message || 'Invalid email or password',
					variant: 'destructive',
				});
				setIsLoggingIn(false);
			}
		} catch (error) {
			console.error('Login error:', error);
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
			setIsLoggingIn(false);
		}
	};

	return (
		<div className="flex justify-center mt-12 bg-background">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleLogin}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email"
								required
								disabled={isLoggingIn}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
								required
								disabled={isLoggingIn}
							/>
							<div className="flex justify-end items-center">
								<Link
									href="/forgot-password"
									className="text-sm text-primary hover:text-primary/80"
								>
									Forgot Password?
								</Link>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full" disabled={isLoggingIn}>
							{isLoggingIn ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Logging in...
								</>
							) : (
								'Login'
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
			<Toaster />
		</div>
	);
};

export default Login;

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { RootState } from '@/store/store'; // Make sure to import RootState type

const Signup = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [isSigningUp, setIsSigningUp] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);

	// Watch for auth state changes and navigate accordingly
	useEffect(() => {
		if (isAuthenticated && isSigningUp) {
			router.push('/');
		}
	}, [isAuthenticated, isSigningUp, router]);

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsSigningUp(true);

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
				dispatch(
					login({
						userId: data.userId,
						email: data.email,
						name: data.name,
					})
				);
				// Navigation will happen via the useEffect
			} else {
				setError(data.message || 'Signup failed');
				setIsSigningUp(false);
			}
		} catch (error) {
			console.error('Signup error:', error);
			setError('An unexpected error occurred');
			setIsSigningUp(false);
		}
	};

	return (
		<div className="flex justify-center mt-12 bg-background">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
					<CardDescription>Create your account to get started</CardDescription>
				</CardHeader>
				<form onSubmit={handleSignup}>
					<CardContent className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
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
				</form>
			</Card>
		</div>
	);
};

export default Signup;
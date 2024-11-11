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
import { RootState } from '@/store/store';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();
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
		setError('');
		setIsLoggingIn(true);

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
				dispatch(
					login({
						userId: data.userId,
						email: data.email,
						name: data.name,
						preferences: data.preferences,
					})
				);
			} else {
				setError(data.message || 'Login failed');
				setIsLoggingIn(false);
			}
		} catch (error) {
			console.error('Login error:', error);
			setError('An unexpected error occurred');
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
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
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
		</div>
	);
};

export default Login;

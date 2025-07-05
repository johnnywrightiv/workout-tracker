'use client';

import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	// Basic email validation regex
	const validateEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Email validation
		if (!email) {
			toast({
				title: 'Error',
				description: 'Please enter your email address',
				variant: 'destructive',
			});
			return;
		}

		if (!validateEmail(email)) {
			toast({
				title: 'Error',
				description: 'Please enter a valid email address',
				variant: 'destructive',
			});
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				toast({
					title: 'Email Sent',
					description:
						'If an account exists with this email, you will receive password reset instructions',
				});
				setEmail('');
			} else {
				toast({
					title: 'Error',
					description: 'Failed to process request. Please try again later.',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="bg-background mt-12 flex justify-center">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Reset Password</CardTitle>
					<CardDescription>
						Enter your email to receive a password reset link
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								required
								disabled={isSubmitting}
								className="w-full"
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Sending...
								</>
							) : (
								'Send Reset Link'
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
			<Toaster />
		</div>
	);
}

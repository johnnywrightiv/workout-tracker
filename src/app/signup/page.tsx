'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Signup = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();

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
				// Redirect to the home page after successful signup
				router.push('/');
			} else {
				setError(data.message);
			}
		} catch (error) {
			setError('Something went wrong. Please try again.');
		}
	};

	return (
		<div className="flex flex-col items-center">
			<h2 className="text-2xl">Sign Up</h2>
			<form onSubmit={handleSignup} className="space-y-4">
				<div>
					<label htmlFor="name">Name</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className="border p-2"
					/>
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="border p-2"
					/>
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="border p-2"
					/>
				</div>
				{error && <p className="text-red-500">{error}</p>}
				<button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white">
					Sign Up
				</button>
			</form>
		</div>
	);
};

export default Signup;

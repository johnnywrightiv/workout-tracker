'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import LogoutButton from '@/components/logout-button';
import { ThemeSelect } from '@/components/theme-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Palette } from 'lucide-react';

export default function SettingsPage() {
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	);

	if (!isAuthenticated) {
		return (
			<div className="container mx-auto py-16 px-4 text-center">
				<h2 className="text-3xl font-bold mb-8">Access Your Settings</h2>
				<p className="text-xl mb-8">
					Please log in to view and manage your settings.
				</p>
				<Button asChild size="lg">
					<Link href="/login">Log In</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 px-4 space-y-8">
			<div className="flex flex-row justify-between items-center gap-4 w-full">
				<h1 className="text-3xl sm:text-4xl font-bold">User Settings</h1>
			</div>

			<div className="space-y-6">
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-2xl font-bold flex items-center">
							<Palette className="mr-2 h-5 w-5" />
							Theme Settings
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<ThemeSelect />
					</CardContent>
				</Card>

				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-2xl font-bold flex items-center">
							<Settings className="mr-2 h-5 w-5" />
							Account Settings
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<LogoutButton />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
'use client';

import LogoutButton from '@/components/logout-button';
import { ThemeSelect } from '@/components/theme-selector';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Component() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-6">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-foreground">
						User Settings
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-foreground">
							Theme Settings
						</h2>
            <ThemeSelect />
					</div>

					<Separator className="my-6" />

					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-foreground">
							Account Settings
						</h2>
            <LogoutButton />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

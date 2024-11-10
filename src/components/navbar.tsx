'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Home, LogIn, UserPlus, File, Settings, Menu } from 'lucide-react';
import { RootState } from '@/store/store';
import WorkoutButton from './new-workout-button';

export default function Navbar() {
	const pathname = usePathname();
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	useEffect(() => {
		setIsSheetOpen(false);
	}, [pathname]);

	const navItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/templates', label: 'Templates', icon: File, authRequired: true },
		{
			href: '/settings',
			label: 'Settings',
			icon: Settings,
			authRequired: true,
		},
	];

	return (
		<nav className="sticky top-0 z-40 w-full border-b bg-background">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center space-x-2">
						<span className="text-2xl font-bold">Workout Tracker</span>
					</Link>

					{/* Main navbar items */}
					<div className="flex items-center space-x-4 ml-auto">
						{/* Desktop Nav Items */}
						<div className="hidden md:flex md:items-center md:space-x-4">
							{navItems.map((item) => {
								if (item.authRequired && !isAuthenticated) return null;
								return (
									<Button key={item.href} variant="ghost" asChild>
										<Link
											href={item.href}
											className="flex items-center space-x-2"
										>
											<item.icon className="h-4 w-4" />
											<span>{item.label}</span>
										</Link>
									</Button>
								);
							})}
							{isAuthenticated && <WorkoutButton />}
						</div>

						{/* Authentication buttons (Desktop) */}
						{!isAuthenticated && <AuthButtons />}

						{/* Mobile Menu Toggle */}
						<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="md:hidden">
									<Menu className="h-5 w-5" />
									<span className="sr-only">Toggle menu</span>
								</Button>
							</SheetTrigger>

							{/* Mobile Menu Content */}
							<SheetContent side="right" className="w-[300px] sm:w-[400px]">
								<SheetTitle>Workout Tracker</SheetTitle>
								<SheetDescription className='mb-4'>Navigation Menu</SheetDescription>
								<nav className="flex flex-col space-y-4">
									{navItems.map((item) => {
										if (item.authRequired && !isAuthenticated) return null;
										return (
											<Link
												key={item.href}
												href={item.href}
												className="flex items-center space-x-2 text-sm font-medium"
											>
												<item.icon className="h-4 w-4" />
												<span>{item.label}</span>
											</Link>
										);
									})}
									{isAuthenticated && (
										<div className="py-4">
											<WorkoutButton />
										</div>
									)}
									{/* Mobile Auth Buttons */}
									{!isAuthenticated && (
										<div className=" space-x-2">
											<Button variant="outline" asChild>
												<Link
													href="/signup"
													className="flex items-center space-x-2"
												>
													<UserPlus className="h-4 w-4" />
													<span>Sign Up</span>
												</Link>
											</Button>
											<Button variant="default" asChild>
												<Link
													href="/login"
													className="flex items-center space-x-2"
												>
													<LogIn className="h-4 w-4" />
													<span>Login</span>
												</Link>
											</Button>
										</div>
									)}
								</nav>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</nav>
	);
}

function AuthButtons() {
	return (
		<div className="hidden md:flex md:items-center md:space-x-4">
			<Button variant="outline" asChild>
				<Link href="/signup" className="flex items-center space-x-2">
					<UserPlus className="h-4 w-4" />
					<span>Sign Up</span>
				</Link>
			</Button>
			<Button variant="default" asChild>
				<Link href="/login" className="flex items-center space-x-2">
					<LogIn className="h-4 w-4" />
					<span>Login</span>
				</Link>
			</Button>
		</div>
	);
}
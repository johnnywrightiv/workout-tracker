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
import {
	Home,
	LogIn,
	UserPlus,
	FileClock,
	Settings,
	Menu,
	LineChart,
} from 'lucide-react';
import { RootState } from '@/store/store';
import WorkoutButton from './new-workout-button';
import { cn } from '@/lib/utils';

export default function Navbar() {
	const pathname = usePathname();
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isVisible, setIsVisible] = useState(true);
	const [scrollThreshold, setScrollThreshold] = useState(0);

	useEffect(() => {
		setIsSheetOpen(false);
	}, [pathname]);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > lastScrollY) {
				// Scrolling down - hide navbar
				setIsVisible(false);
				setScrollThreshold(currentScrollY);
			} else if (currentScrollY < scrollThreshold - 50) {
				// Scrolling up past threshold - show navbar
				setIsVisible(true);
			}

			setLastScrollY(currentScrollY);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [lastScrollY, scrollThreshold]);

	const navItems = [
		{ href: '/', label: 'Home', icon: Home },
		{
			href: '/templates',
			label: 'Templates',
			icon: FileClock,
			authRequired: true,
		},
		{
			href: '/progress',
			label: 'Progress',
			icon: LineChart,
			authRequired: true,
		},
		{
			href: '/settings',
			label: 'Settings',
			icon: Settings,
			authRequired: true,
		},
	];

	const mobileNavItems = navItems.filter((item) => item.label !== 'Settings');
	const settingsItem = navItems.find((item) => item.label === 'Settings');

	return (
		<>
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
							<div className="hidden md:flex md:items-center md:space-x-2">
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

							{/* Mobile Nav - Always show WorkoutButton */}
							{/* The WorkoutButton should be visible on mobile */}
							{isAuthenticated && (
								<div className="md:hidden">
									<WorkoutButton />
								</div>
							)}

							{/* Authentication buttons (Desktop) */}
							{!isAuthenticated && <AuthButtons />}

							{/* Mobile Menu Toggle - Only for non-authenticated users */}
							{!isAuthenticated && (
								<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
									<SheetTrigger asChild>
										<Button variant="ghost" size="icon" className="md:hidden">
											<Menu className="h-5 w-5" />
											<span className="sr-only">Toggle menu</span>
										</Button>
									</SheetTrigger>

									{/* Mobile Menu Content for non-authenticated users */}
									<SheetContent
										side="right"
										className="w-[300px] sm:w-[400px] animate-slide-in-from-right"
									>
										<SheetTitle>Workout Tracker</SheetTitle>
										<SheetDescription className="mb-4">
											Navigation Menu
										</SheetDescription>
										<div className="space-y-4">
											<Link
												href="/"
												className="flex items-center space-x-2 text-sm font-medium"
											>
												<Home className="h-4 w-4" />
												<span>Home</span>
											</Link>
											<div className="space-x-2">
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
										</div>
									</SheetContent>
								</Sheet>
							)}
						</div>
					</div>
				</div>
			</nav>

			{/* Mobile Bottom Navigation Bar */}
			{isAuthenticated && (
				<div
					className={`fixed bottom-0 left-0 right-0 z-10 flex flex-row justify-between space-x-2 border-t border-primary bg-background p-2 md:hidden transition-transform duration-300 ${
						isVisible ? 'translate-y-0' : 'translate-y-full'
					}`}
					role="navigation"
					aria-label="Mobile Navigation"
				>
					{[...mobileNavItems, settingsItem].map((link) => {
						const Icon = link.icon;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									'flex h-[48px] grow items-center justify-center rounded-[--radius] p-3 text-sm font-medium text-muted-foreground hover:bg-secondary/30 hover:text-card-foreground focus:outline-none focus:ring-1 focus:ring-primary',
									{
										'bg-secondary/30 text-primary hover:text-primary':
											pathname === link.href,
									}
								)}
								aria-current={pathname === link.href ? 'page' : undefined}
							>
								<Icon className="w-6" aria-hidden="true" />
								<span className="sr-only">{link.label}</span>
							</Link>
						);
					})}
				</div>
			)}
		</>
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

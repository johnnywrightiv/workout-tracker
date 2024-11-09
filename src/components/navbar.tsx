'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import {
	Home,
	LogIn,
	UserPlus,
	User,
	Moon,
	Sun,
	File,
	Menu,
} from 'lucide-react';
import LogoutButton from '@/components/logout-button';
import { RootState } from '@/store/store';
import WorkoutButton from './new-workout-button';

export default function Navbar() {
	const pathname = usePathname();
	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth
	);
	const { theme, setTheme } = useTheme();

	// State to manage Sheet visibility
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	// Close the Sheet when the pathname changes (i.e., navigation occurs)
	useEffect(() => {
		// Close the sheet on navigation
		setIsSheetOpen(false);
	}, [pathname]);

	const navItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/templates', label: 'Templates', icon: File, authRequired: true },
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
									<Button
										key={item.href}
										variant="ghost" // Removed the active link check and highlighting
										asChild
									>
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
						{isAuthenticated ? (
							<UserMenu user={user} theme={theme} setTheme={setTheme} />
						) : (
							<AuthButtons />
						)}

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
								<SheetTitle className="mb-2">Workout Tracker</SheetTitle>
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
										<div className="space-y-4">
											<Button variant="ghost" asChild>
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

function UserMenu({ user, theme, setTheme }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="flex items-center space-x-2">
					<Avatar className="h-8 w-8">
						<AvatarImage src="/avatars/01.png" alt={user?.name} />
						<AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
					</Avatar>
					<div className="hidden md:block">
						<div className="flex font-medium">{user?.name}</div>
						<div className="text-xs text-muted-foreground">{user?.email}</div>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuItem asChild>
					<Link href="/profile" className="flex items-center">
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
				>
					{theme === 'dark' ? (
						<Sun className="mr-2 h-4 w-4" />
					) : (
						<Moon className="mr-2 h-4 w-4" />
					)}
					<span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<LogoutButton />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function AuthButtons() {
	return (
		<div className="hidden md:flex md:items-center md:space-x-4">
			<Button variant="ghost" asChild>
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

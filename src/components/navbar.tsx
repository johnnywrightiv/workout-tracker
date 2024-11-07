// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useSelector } from 'react-redux';
// import { ThemeSelect } from '@/components/theme-selector';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Dumbbell, Home, LogIn, UserPlus, User } from 'lucide-react';
// import LogoutButton from '@/components/logout-button';
// import { RootState } from '@/store/store';

// export default function Navbar() {
// 	const pathname = usePathname();
// 	const { isAuthenticated, user } = useSelector(
// 		(state: RootState) => state.auth
// 	);

// 	const navItems = [
// 		{ href: '/', label: 'Home', icon: Home },
// 		{ href: '/workout/new', label: 'New Workout', icon: Dumbbell },
// 	];

// 	return (
// 		<nav className="w-full bg-background border-b">
// 			<div className="container mx-auto px-4">
// 				<div className="flex items-center justify-between h-16">
// 					<Link href="/" className="text-2xl font-bold">
// 						Workout Tracker
// 					</Link>
// 					<div className="flex items-center space-x-4">
// 						{navItems.map((item) => {
// 							const Icon = item.icon;
// 							return (
// 								<Button
// 									key={item.href}
// 									variant={pathname === item.href ? 'default' : 'ghost'}
// 									asChild
// 								>
// 									<Link
// 										href={item.href}
// 										className="flex items-center space-x-2"
// 									>
// 										<Icon className="h-4 w-4" />
// 										<span>{item.label}</span>
// 									</Link>
// 								</Button>
// 							);
// 						})}
// 						{isAuthenticated ? (
// 							<DropdownMenu>
// 								<DropdownMenuTrigger asChild>
// 									<Button
// 										variant="ghost"
// 										className="relative h-8 w-8 rounded-full"
// 									>
// 										<Avatar className="h-8 w-8">
// 											<AvatarImage src="/avatars/01.png" alt={user?.name} />
// 											<AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
// 										</Avatar>
// 									</Button>
// 								</DropdownMenuTrigger>
// 								<DropdownMenuContent className="w-56" align="end" forceMount>
// 									<DropdownMenuItem className="flex flex-col items-start">
// 										<div className="font-medium">{user?.name}</div>
// 										<div className="text-xs text-muted-foreground">
// 											{user?.email}
// 										</div>
// 									</DropdownMenuItem>
// 									<DropdownMenuItem>
// 										<User className="mr-2 h-4 w-4" />
// 										<span>Profile</span>
// 									</DropdownMenuItem>
// 									<DropdownMenuItem>
// 										<LogoutButton />
// 									</DropdownMenuItem>
// 								</DropdownMenuContent>
// 							</DropdownMenu>
// 						) : (
// 							<>
// 								<Button variant="ghost" asChild>
// 									<Link href="/signup" className="flex items-center space-x-2">
// 										<UserPlus className="h-4 w-4" />
// 										<span>Sign Up</span>
// 									</Link>
// 								</Button>
// 								<Button variant="ghost" asChild>
// 									<Link href="/login" className="flex items-center space-x-2">
// 										<LogIn className="h-4 w-4" />
// 										<span>Login</span>
// 									</Link>
// 								</Button>
// 							</>
// 						)}
// 						<ThemeSelect />
// 					</div>
// 				</div>
// 			</div>
// 		</nav>
// 	);
// }
'use client';

import Link from 'next/link';
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
import { Dumbbell, Home, LogIn, UserPlus, User, Moon, Sun } from 'lucide-react';
import LogoutButton from '@/components/logout-button';
import { RootState } from '@/store/store';

export default function Navbar() {
	const pathname = usePathname();
	const { isAuthenticated, user } = useSelector(
		(state: RootState) => state.auth
	);
	const { theme, setTheme } = useTheme();

	const navItems = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/workout/new', label: 'New Workout', icon: Dumbbell },
	];

	return (
		<nav className="fixed top-0 w-full bg-background border-b">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<Link href="/" className="text-2xl font-bold">
						Workout Tracker
					</Link>
					<div className="flex items-center space-x-4">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<Button
									key={item.href}
									variant={pathname === item.href ? 'default' : 'ghost'}
									asChild
								>
									<Link
										href={item.href}
										className="flex items-center space-x-2"
									>
										<Icon className="h-4 w-4" />
										<span>{item.label}</span>
									</Link>
								</Button>
							);
						})}
						{isAuthenticated ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="flex items-center space-x-2"
									>
										<Avatar className="h-8 w-8 -ml-2">
											<AvatarImage src="/avatars/01.png" alt={user?.name} />
											<AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<div className="flex font-medium">{user?.name}</div>
											<div className="text-xs text-muted-foreground">
												{user?.email}
											</div>
										</div>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end" forceMount>
									<DropdownMenuItem>
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											setTheme(theme === 'dark' ? 'light' : 'dark')
										}
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
						) : (
							<>
								<Button variant="ghost" asChild>
									<Link href="/signup" className="flex items-center space-x-2">
										<UserPlus className="h-4 w-4" />
										<span>Sign Up</span>
									</Link>
								</Button>
								<Button variant="ghost" asChild>
									<Link href="/login" className="flex items-center space-x-2">
										<LogIn className="h-4 w-4" />
										<span>Login</span>
									</Link>
								</Button>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
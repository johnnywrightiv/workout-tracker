'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/auth-slice';
import { clearWorkouts } from '@/store/workouts-slice';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch();

	const handleLogout = async () => {
		setIsLoggingOut(true);

		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if (response.ok) {
				dispatch(logout());
				dispatch(clearWorkouts());
				router.push('/login');
			} else {
				console.error('Logout failed');
			}
		} catch (error) {
			console.error('Error during logout', error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
			<LogOut className="mr-2 h-4 w-4" />
			<span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
		</DropdownMenuItem>
	);
};

export default LogoutButton;
'use client';

import { useDispatch } from 'react-redux';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/store/auth-slice';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const LogoutButton = () => {
	const dispatch = useDispatch();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await axios.post(
				'/api/auth/logout',
				{},
				{
					withCredentials: true,
				}
			);

			dispatch(logout());

			router.push('/');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return (
		<Button onClick={handleLogout}>
			<LogOut className="mr-2 h-4 w-4" />
			<span>Logout</span>
		</Button>
	);
};

export default LogoutButton;

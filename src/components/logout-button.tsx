'use client'

import { useDispatch } from 'react-redux';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/store/auth-slice';
import { useRouter } from 'next/navigation';

const LogoutButton = ({ variant = 'dropdown' }) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const handleLogout = () => {
		dispatch(logout());
		router.push('/');
	};

	return (
		<Button onClick={handleLogout}>
			<LogOut className="mr-2 h-4 w-4" />
			<span>Logout</span>
		</Button>
	);
};

export default LogoutButton;
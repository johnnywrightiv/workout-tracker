'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUnauthenticated } from '@/store/auth-slice';
import axios from 'axios';

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const dispatch = useDispatch();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await axios.get('/api/auth/check', {
					withCredentials: true,
				});

				if (response.status === 200 && response.data.isAuthenticated) {
					dispatch(setAuthenticated(response.data.user));
				} else {
					dispatch(setUnauthenticated());
				}
			} catch (error) {
				dispatch(setUnauthenticated());
			}
		};

		checkAuth();
	}, [dispatch]);

	return <>{children}</>;
}

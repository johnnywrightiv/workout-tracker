'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const colorScheme = useSelector(
    (state: RootState) => state.auth.user?.preferences?.colorScheme || 'blue',
  );

  // Initial setup effect
  useEffect(() => {
    const storedScheme = localStorage.getItem('colorScheme');
    if (storedScheme) {
      document.documentElement.classList.add(`theme-${storedScheme}`);
    } else {
      document.documentElement.classList.add(`theme-${colorScheme}`);
    }
    setIsLoading(false);
  });

  // Theme update effect
  useEffect(() => {
    if (!isLoading) {
      const newTheme = `theme-${colorScheme}`;
      const root = document.documentElement;

      // Remove all possible theme classes
      root.classList.remove(
        'theme-blue',
        'theme-purple',
        'theme-orange',
        'theme-stone',
      );

      // Add new theme class
      root.classList.add(newTheme);

      // Only update localStorage if user is authenticated
      if (isAuthenticated) {
        localStorage.setItem('colorScheme', colorScheme);
      }
    }
  }, [colorScheme, isLoading, isAuthenticated]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

'use client';

import * as React from 'react';
import { Ruler } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateUserPreferences } from '@/store/auth-slice';
import { RootState } from '@/store/store';

type MeasurementSystem = 'metric' | 'imperial';

export function MeasurementSystemSelect() {
  const dispatch = useDispatch();
  const currentSystem = useSelector(
    (state: RootState) =>
      state.auth.user?.preferences?.measurementSystem || 'metric',
  );

  const handleMeasurementSystemChange = async (
    newSystem: MeasurementSystem,
  ) => {
    try {
      // Store the current value for potential rollback
      const previousSystem = currentSystem;

      // Optimistically update the UI
      dispatch(updateUserPreferences({ measurementSystem: newSystem }));

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ measurementSystem: newSystem }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert to previous value if the request failed
        dispatch(updateUserPreferences({ measurementSystem: previousSystem }));
        throw new Error(data.message || 'Failed to update measurement system');
      }
    } catch (error) {
      console.error('Error updating measurement system:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          <span>
            Weight System:{' '}
            {currentSystem.charAt(0).toUpperCase() + currentSystem.slice(1)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleMeasurementSystemChange('imperial')}
          className="flex cursor-pointer items-center"
        >
          Imperial
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleMeasurementSystemChange('metric')}
          className="flex cursor-pointer items-center"
        >
          Metric
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

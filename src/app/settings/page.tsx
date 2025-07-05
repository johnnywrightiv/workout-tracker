'use client';

import { ColorSchemeSelect } from '@/components/color-scheme-select';
import LogoutButton from '@/components/logout-button';
import { MeasurementSystemSelect } from '@/components/measurement-system-select';
import { ThemeSelect } from '@/components/theme-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold sm:text-4xl">User Settings</h1>
      </div>

      <div className="space-y-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold">
              <Palette className="mr-2 h-5 w-5" />
              Theme Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <ThemeSelect />
            </div>
            <ColorSchemeSelect />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold">
              <Settings className="mr-2 h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MeasurementSystemSelect />
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

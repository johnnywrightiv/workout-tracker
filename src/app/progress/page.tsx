import { Suspense } from 'react';
import ProgressDashboard from '@/components/progress-dashboard';
import ProgressSkeleton from '@/components/progress-skeleton';

export default function ProgressPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Workout Progress</h1>
      <Suspense fallback={<ProgressSkeleton />}>
        <ProgressDashboard />
      </Suspense>
    </div>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ClockIcon } from 'lucide-react';
import { FormData } from '@/types/workout';

interface WorkoutDetailsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  workoutStatus: 'not_started' | 'in_progress' | 'completed';
  isTemplate: boolean;
  renderControlButton?: (className?: string) => React.ReactNode;
}

export function WorkoutDetails({
  formData,
  setFormData,
  workoutStatus,
  isTemplate,
  renderControlButton,
}: WorkoutDetailsProps) {
  const formatTime = (isoString: string) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Workout Name
            </label>
            <div className="flex items-center space-x-4">
              <Input
                id="name"
                placeholder="e.g. Leg Day"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="flex-1"
              />
              {!isTemplate && renderControlButton && renderControlButton()}
            </div>
          </div>

          {workoutStatus === 'in_progress' && (
            <div className="flex items-center justify-end space-x-1 text-sm">
              <ClockIcon className="text-muted-foreground h-4 w-4" />
              <span>Started: {formatTime(formData.startTime)}</span>
            </div>
          )}
          {workoutStatus === 'completed' && (
            <div className="flex items-center justify-evenly text-xs sm:text-sm">
              <div className="flex items-center space-x-1">
                <span>Start: {formatTime(formData.startTime)} - </span>
                <span>End: {formatTime(formData.endTime)}</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <ClockIcon className="text-muted-foreground h-4 w-4" />
                <span>{formData.duration} minutes</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about the workout"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="min-h-[80px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MUSCLE_GROUPS, WEIGHT_TYPES, EXERCISE_TYPES } from '@/lib/constants';
import { Exercise } from '@/types/workout';
import { IncrementDecrementButton } from './increment-decrement-button';
import { convertDistance, convertWeight } from '@/lib/utils';

interface ExerciseFormProps {
  exercise: Exercise;
  onChange: (updatedExercise: Exercise) => void;
  onRemove: () => void;
  measurementSystem: 'metric' | 'imperial';
}

export function ExerciseForm({
  exercise,
  onChange,
  onRemove,
  measurementSystem,
}: ExerciseFormProps) {
  const handleChange = (field: keyof Exercise, value: string | number) => {
    onChange({ ...exercise, [field]: value });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Exercise Name
              </label>
              <Input
                id="name"
                placeholder="e.g. Bench Press"
                value={exercise.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="exerciseType" className="text-sm font-medium">
                Exercise Type
              </label>
              <Select
                value={exercise.exerciseType}
                onValueChange={(value) => handleChange('exerciseType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exercise type" />
                </SelectTrigger>
                <SelectContent>
                  {EXERCISE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {exercise.exerciseType === 'Strength' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="muscleGroup" className="text-sm font-medium">
                    Muscle Group
                  </label>
                  <Select
                    value={exercise.muscleGroup}
                    onValueChange={(value) =>
                      handleChange('muscleGroup', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select muscle group" />
                    </SelectTrigger>
                    <SelectContent>
                      {MUSCLE_GROUPS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="weightType" className="text-sm font-medium">
                    Weight Type
                  </label>
                  <Select
                    value={exercise.weightType}
                    onValueChange={(value) => handleChange('weightType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weight type" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEIGHT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="min-w-0 space-y-2 text-center">
                  <label
                    htmlFor="sets"
                    className="truncate text-clip text-sm font-medium"
                  >
                    Sets
                  </label>
                  <IncrementDecrementButton
                    value={exercise.sets}
                    onChange={(value) => handleChange('sets', value)}
                  />
                </div>
                <div className="min-w-0 space-y-2 text-center">
                  <label
                    htmlFor="reps"
                    className="truncate text-sm font-medium"
                  >
                    Reps
                  </label>
                  <IncrementDecrementButton
                    value={exercise.reps}
                    onChange={(value) => handleChange('reps', value)}
                  />
                </div>
                <div className="min-w-0 space-y-2 text-center">
                  <label
                    htmlFor="weight"
                    className="truncate text-sm font-medium"
                  >
                    Weight ({measurementSystem === 'metric' ? 'kg' : 'lbs'})
                  </label>
                  <IncrementDecrementButton
                    value={
                      measurementSystem === 'metric'
                        ? convertWeight(exercise.weight, 'kg')
                        : exercise.weight
                    }
                    onChange={(value) => handleChange('weight', value)}
                    step={measurementSystem === 'metric' ? 2.5 : 5}
                    allowDecimals={true}
                  />
                </div>
              </div>
            </>
          )}

          {exercise.exerciseType === 'Cardio' && (
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="min-w-0 space-y-2">
                <label
                  htmlFor="duration"
                  className="truncate text-sm font-medium"
                >
                  Duration (mins)
                </label>
                <IncrementDecrementButton
                  value={exercise.duration}
                  onChange={(value) => handleChange('duration', value)}
                />
              </div>
              <div className="min-w-0 space-y-2">
                <label
                  htmlFor="distance"
                  className="truncate text-sm font-medium"
                >
                  Distance ({measurementSystem === 'metric' ? 'km' : 'miles'})
                </label>
                <IncrementDecrementButton
                  value={
                    measurementSystem === 'metric'
                      ? convertDistance(exercise.distance, 'km')
                      : exercise.distance
                  }
                  onChange={(value) => handleChange('distance', value)}
                  step={0.1}
                  allowDecimals={true}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              value={exercise.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any specific instructions or notes"
              className="min-h-[60px]"
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onRemove}
            >
              Remove Exercise
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

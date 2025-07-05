import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { EXERCISE_TYPES, MUSCLE_GROUPS, WEIGHT_TYPES } from '@/lib/constants';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type React from 'react'; // Added import for React

interface FilterContentProps {
  filters: {
    exerciseTypes: Set<string>;
    muscleGroups: Set<string>;
    weightTypes: Set<string>;
    dateRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
  };
  setFilters: React.Dispatch<
    React.SetStateAction<FilterContentProps['filters']>
  >;
  resetFilters: () => void;
}

export function FilterContent({
  filters,
  setFilters,
  resetFilters,
}: FilterContentProps) {
  return (
    <>
      <SheetHeader className="mt-4">
        <SheetTitle>Filter Workouts</SheetTitle>
      </SheetHeader>
      <SheetDescription className="mb-2">
        Configure options to filter your workout history
      </SheetDescription>
      <div className="space-y-6 py-4">
        <div className="space-y-4">
          <Label>Date Range</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full max-w-full justify-start truncate whitespace-nowrap text-left font-normal sm:w-[140px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    format(filters.dateRange.from, 'PPP')
                  ) : (
                    <span>From date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.from}
                  onSelect={(date) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        from: date ?? undefined,
                      },
                    }))
                  }
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full max-w-full justify-start truncate whitespace-nowrap text-left font-normal sm:w-[140px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.to ? (
                    format(filters.dateRange.to, 'PPP')
                  ) : (
                    <span>To date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.to}
                  onSelect={(date) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        to: date ?? undefined,
                      },
                    }))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {[
          {
            title: 'Exercise Type',
            items: EXERCISE_TYPES,
            filterKey: 'exerciseTypes' as const,
          },
          {
            title: 'Muscle Group',
            items: MUSCLE_GROUPS,
            filterKey: 'muscleGroups' as const,
          },
          {
            title: 'Weight Type',
            items: WEIGHT_TYPES,
            filterKey: 'weightTypes' as const,
          },
        ].map(({ title, items, filterKey }) => (
          <div key={title} className="space-y-4">
            <Label>{title}</Label>
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filterKey}-${item}`}
                    checked={filters[filterKey].has(item)}
                    onCheckedChange={(checked) => {
                      setFilters((prev) => {
                        const newSet = new Set(prev[filterKey]);
                        if (checked) {
                          newSet.add(item);
                        } else {
                          newSet.delete(item);
                        }
                        return { ...prev, [filterKey]: newSet };
                      });
                    }}
                  />
                  <Label htmlFor={`${filterKey}-${item}`} className="text-sm">
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SheetFooter className="mt-8">
        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
      </SheetFooter>
    </>
  );
}

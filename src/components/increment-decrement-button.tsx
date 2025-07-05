import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface IncrementDecrementButtonProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  allowDecimals?: boolean;
}

export function IncrementDecrementButton({
  value,
  onChange,
  min = 0,
  step = 1,
  allowDecimals = false,
}: IncrementDecrementButtonProps) {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const newValue = Number(Math.max(min, value - step).toFixed(2));
          onChange(newValue);
        }}
        disabled={value <= min}
        className="h-8 w-8"
      >
        -
      </Button>
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const newValue =
            e.target.value === ''
              ? min
              : Math.max(min, parseFloat(e.target.value));
          onChange(
            allowDecimals ? Number(newValue.toFixed(2)) : Math.floor(newValue),
          );
        }}
        className="mx-1 flex h-8 w-1/4 text-center"
        min={min}
        step={allowDecimals ? '0.01' : '1'}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const newValue = Number((value + step).toFixed(2));
          onChange(newValue);
        }}
        className="h-8 w-8"
      >
        +
      </Button>
    </div>
  );
}

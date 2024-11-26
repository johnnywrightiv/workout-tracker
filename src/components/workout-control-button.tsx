import { Button } from '@/components/ui/button';

interface WorkoutControlButtonProps {
	workoutStatus: 'not_started' | 'in_progress' | 'completed';
	onStart: () => void;
	onEnd: () => void;
	className?: string;
}

export function WorkoutControlButton({
	workoutStatus,
	onStart,
	onEnd,
	className = '',
}: WorkoutControlButtonProps) {
	if (workoutStatus === 'completed') {
		return null;
	}

	return (
		<Button
			type="button"
			onClick={workoutStatus === 'not_started' ? onStart : onEnd}
			size="sm"
			variant={workoutStatus === 'not_started' ? 'default' : 'secondary'}
			className={className}
		>
			{workoutStatus === 'not_started' ? 'Start Workout' : 'End Workout'}
		</Button>
	);
}

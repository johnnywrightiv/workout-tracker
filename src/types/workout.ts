export interface Exercise {
	name: string;
	sets: number;
	reps: number;
	weight: number;
	notes: string;
	muscleGroup: string;
	weightType: string;
	equipmentSettings: string;
	duration: number;
	exerciseType: string;
	speed: number;
	distance: number;
	completed: boolean;
}

export interface FormData {
	name: string;
	startTime: string;
	endTime: string;
	duration: number;
	notes: string;
	exercises: Exercise[];
}

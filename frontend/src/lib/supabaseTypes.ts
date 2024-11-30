// Define types for better type safety
export interface UpdateUserData {
    id: string | undefined;
    full_name?: string;
    username?: string;
    age: Number;
    avatar_url?: string;
    bio?: string;
    fitness_level?: Number;
    weight: Number;
}

export interface AddWeightData {
  user_id: string | undefined;
  weight: number;
}

// used for new workouts
export interface AddWorkoutData {
  workoutName: string;
  user_id: string | undefined;
  id: string | undefined;
}

// used for new exercises
export interface AddExerciseData {
  workout_id: string | undefined;
  exerciseName: string;
  duration: number;
  calories_burned: number;
  exerciseSets: number | undefined;
  exerciseReps: number | undefined;
  exerciseWeight: number | undefined;
}
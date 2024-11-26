// Define types for better type safety
export interface UpdateUserData {
    id: string | undefined;
    full_name?: string;
    username?: string;
    age?: Number;
    avatar_url?: string;
    bio?: string;
    fitness_level?: Number;
  }
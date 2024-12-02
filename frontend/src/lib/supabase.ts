import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ExerciseData, AddWeightData, AddWorkoutData, DeleteExerciseData, UpdateUserData, UpdateExerciseData, AddMealData, DeleteMealData, EditMealData } from './supabaseTypes';
import { format } from 'date-fns';

const supabaseUrl = 'https://tlssadzfzfxcufxvijlt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsc3NhZHpmemZ4Y3VmeHZpamx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNzEzODcsImV4cCI6MjA0Njk0NzM4N30.UNXzMbLvruACs5RdXp_Vy9N5ZPKkASbZlb41KnpcUu0';

export const supabase = createClient(supabaseUrl, supabaseKey);

// need to get current day and add it to our new date, 
// stored globally for all supabase functions
const created_at = format(new Date(), 'yyyy-MM-dd');

//used to create a user, first in auth, then in our database
export const createUser = async (email: string, password: string) => {
  console.log("User", email, " : ", password);
  const { data, error } = await supabase.auth.signUp({ email, password });

  if(error)
    return window.alert(error.message);

  if(!data || !data.session)
    return window.alert('Sign up succeeded, but session data is unavailable');

  console.log('Data: ', data);

  // now get the profile assocaited with it
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.session.user.id)
    .single();
  return profileData;
}

// sign our user into our app
export const signIn = async (email: string, password: string) => {

  try {
    // sign our user in
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    });
    
    if(error)
      return window.alert(error.message);
    
    //if we dont get an error, grab the profile associated with the auth
    const { data: profileData }= await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.session.user.id)
    .single();
    
    return profileData;
    
  } catch (error) {
    console.log('Error', error)
  }
}

// log out our user
export const logOut = async () => {
  const { error } = await supabase.auth.signOut();
  if(error) throw new Error(error.message);
}

// used to get our user's data in a query
export const useGetUserQuery = async (type: string, id: number) => ({
  queryKey: ['profiles', id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq(type, id)
      .single();

    if(error)
      throw new Error(error.message);
    return data
  }
})

//update our user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserData, Error, UpdateUserData>({
    mutationFn: async (data: UpdateUserData) => {
      //first we need to update the profiles table for the user
      const { error, data: updatedUser } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          username: data.username,
          avatar_url: data.avatar_url,
          bio: data.bio,
          fitness_level: data.fitness_level,
          age: data.age
        })
        .eq('id', data.id)
        .select()
        .single();
        
      // now we need to update the weight table for the user
      const { error: weightError, data: userWeights } = await supabase
        .from('weights')
        .insert({
          created_at: created_at,
          weight: data.weight,
          user_id: data.id
        })
      
      if(error)
        throw new Error(error.message);
      return updatedUser;
    },
    async onSuccess(updatedUser, { id }) {
      // Optimistically update the cache if needed
      queryClient.setQueryData(['profiles', id], updatedUser);

      // invalidate queries to ensure fresh data fetch
      // do this for user data and their weight data
      queryClient.invalidateQueries({ queryKey: ['profiles', id] });
      queryClient.invalidateQueries({ queryKey: ['profileWeights', id] });

    }
  })
}

// get all our weights given a userId
export const useGetUserWeights = (id: string | undefined) => {
  return useQuery({
    queryKey: ['profileWeights', id],
    queryFn: async () => {
      const { error, data } = await supabase
        .from('weights')
        .select('*')
        .eq('user_id', id);

      if(error)
        throw new Error(error.message);
      return data;
    }
  })
}

// allows us to add a new weight for the user
export const useAddUserWeight = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddWeightData>({
    mutationFn: async (data: AddWeightData) => {

      const { error } = await supabase
        .from('weights')
        .insert({
          created_at: created_at,
          weight: data.weight,
          user_id: data.user_id
        })
        .select();

        if(error)
          throw new Error(error.message);
    }, 
    async onSuccess(newWeightData, { user_id }) {
      // do this for user data and their weight data
      queryClient.invalidateQueries({ queryKey: ['profileWeights', user_id] });

    }
  })
}

// get all workouts for the user
export const useGetUserWorkouts = (id: string | undefined) => {
  return useQuery({
    queryKey: ['workouts', id],
    queryFn: async () => {
      const { error, data } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', id);
        
      if(error)
        throw new Error(error.message)
      return data;
    }
  })
}

// get all exercises associated with a user
export const useGetUserExercises = (id: string | undefined) => {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const { error, data } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', id);

      if(error)
        throw new Error(error.message);

      return data;
    }
  })
}

// get all exercises associated with a particular workout
export const useGetWorkoutExercises = (id: string | undefined) => {
  return useQuery({
    queryKey: ['exercises', id],
    queryFn: async () => {
      const { error, data } = await supabase
        .from('exercises')
        .select('*')
        .eq('workout_id', id);

      if(error)
        throw new Error(error.message);
      return data;
    }
  })
}

// add workout to database
export const useAddWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation<AddWorkoutData, Error, AddWorkoutData>({
    mutationFn: async (data: AddWorkoutData) => {
      const { error, data: newWorkoutData } = await supabase
        .from('workouts')
        .insert({
          created_at: created_at,
          name: data.workoutName,
          user_id: data.user_id,
        })
        .select('*')
        .single();

        if(error)
          throw new Error(error.message);

        return newWorkoutData;
    },
    async onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['workouts']});
    }
  })
}

//adds exercise to database
export const useAddExercise = () => {
  const queryClient = useQueryClient();

  return useMutation<ExerciseData, Error, ExerciseData>({
    mutationFn: async (data: ExerciseData) => {
      const { error, data: newExerciseData } = await supabase
        .from('exercises')
        .insert({
          workout_id: data.workout_id,
          user_id: data.user_id,
          name: data.exerciseName,
          duration: data.duration,
          calories_burned: data.calories_burned,
          created_at: created_at,
          weight: data.exerciseWeight,
          reps: data.exerciseReps,
          sets: data.exerciseSets,
        })
        .select('*')
        .single();

      if(error)
        throw new Error(error.message);
      return newExerciseData
    },
    async onSuccess({ workout_id }) {
      queryClient.invalidateQueries({ queryKey: ['workout', workout_id] })
      queryClient.invalidateQueries({ queryKey: ['exercies'] })
    }
  })
}

// update exercise from database 
export const useUpdateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UpdateExerciseData>({
    mutationFn: async (data: UpdateExerciseData) => {
      const { error } = await supabase
        .from('exercises')
        .update({
          name: data.exerciseName,
          duration: data.duration,
          calories_burned: data.calories_burned,
          sets: data.exerciseSets,
          reps: data.exerciseReps,
          weight: data.exerciseWeight,
        })
        .eq('id', data.id);

      if (error)
        throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    }
  })
}

// delete exercise from database 
export const useDeleteExercise = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteExerciseData>({
    mutationFn: async (data: DeleteExerciseData) => {
      const { error: exerciseError } = await supabase
      .from('exercises')
      .delete()
      .eq('id', data.id);
      
      // if this is the last exercise of a workout, just delete the workout
      const { data: exercises } = await supabase
        .from('exercises')
        .select('*')
        .eq('workout_id', data.workout_id);

      // if length is 0, we know that was the last exercise of that workout
      if(exercises?.length === 0) {
        const { error } = await supabase
          .from('workouts')
          .delete()
          .eq('id', data.workout_id);
      }

      if (exerciseError)
        throw new Error("Error deleting exercise");
    },
    onSuccess: () => {
      // Invalidate queries to refresh exercise data
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  })
}

// add a meal
export const useAddMeal = () => {
  const queryClient = useQueryClient();

  return useMutation<AddMealData, Error, AddMealData>({
    mutationFn: async (data: AddMealData) => {
      const { error, data: newMeal } = await supabase
        .from('meals')
        .insert({
          created_at: created_at,
          name: data.name,
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fats: data.fats,
          quantity: data.quantity,
          meal_type: data.meal_type,
          user_id: data.user_id
        })
        .select('*')
        .single();

        if(error)
          throw new Error(error.message);
        return newMeal;
    },
    async onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    }
  })
}

// get all meals from a user
export const useGetUserMeals = (id: string | undefined) => {
  return useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      const { error, data } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', id)

      if(error)
        throw new Error(error.message)
      return data;
    }
  })
} 

// edit a meal
export const useEditMeal = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, EditMealData>({
    mutationFn: async (data: EditMealData) => {
      const { error } = await supabase
        .from('meals')
        .update({
          name: data.name,
          calories: data.calories,
          carbs: data.carbs,
          protein: data.protein,
          fats: data.fats,
          quantity: data.quantity,
        })
        .eq('id', data.id);

      if(error)
        throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    }
  })
}

// delete a meal
export const useDeleteMeal = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteMealData>({
    mutationFn: async (data: DeleteMealData) => {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', data.id);

      if(error)
        throw new Error(error.message);
    },
    onSuccess: () => {
      // Invalidate queries to refresh meal data
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  })
}



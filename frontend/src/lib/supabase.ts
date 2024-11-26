import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateUserData } from './supabaseTypes';

const supabaseUrl = 'https://tlssadzfzfxcufxvijlt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsc3NhZHpmemZ4Y3VmeHZpamx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNzEzODcsImV4cCI6MjA0Njk0NzM4N30.UNXzMbLvruACs5RdXp_Vy9N5ZPKkASbZlb41KnpcUu0';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
export const getUserQuery = async (type: string, id: number) => ({
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

// //update our user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserData, Error, UpdateUserData>({
    mutationFn: async (data: UpdateUserData) => {
      const { error, data: updatedUser } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          bio: data.bio,
          fitness_level: data.fitness_level,
          age: data.age
        })
        .eq('id', data.id)
        .select()
        .single();
      
      if(error)
        throw new Error(error.message);
      return updatedUser;
    },
    async onSuccess(updatedUser, { id }) {
      // Optimistically update the cache if needed
      queryClient.setQueryData(['profiles', id], updatedUser);

      // invalidate queries to ensure fresh data fetch
      queryClient.invalidateQueries({ queryKey: ['profiles', id] });

    }
  })
}
import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react';

const supabaseUrl = 'https://tlssadzfzfxcufxvijlt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsc3NhZHpmemZ4Y3VmeHZpamx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNzEzODcsImV4cCI6MjA0Njk0NzM4N30.UNXzMbLvruACs5RdXp_Vy9N5ZPKkASbZlb41KnpcUu0';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return localStorage.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    localStorage.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    localStorage.deleteItemAsync(key);
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
      storage: ExpoSecureStoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionUrl: false,
  }
});

//used to create a user, first in auth, then in our database
export const createUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if(error)
    return window.alert(error.message);

  // now get the profile assocaited with it
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.session.user.id)
    .single();
  return profileData;
}

// sign our user into our app
export const signIn = async (email, password) => {

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

// used to get our user's data
export const getUser = async (type: string, id: number) => {
  return useQuery({
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
}

//update our user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data) {
      const { error, data: updatedUser } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          bio: data.bio,
          fitness_level: data.fitness_level
        })
        .eq('id', data.id)
        .select()
        .single();
      
      if(error)
        throw new Error(error.message);
    },
    async onSuccess(_, { id }) {
      queryClient.invalidateQueries(['profiles', id]);
    }
  })
}
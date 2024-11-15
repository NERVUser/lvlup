import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://tlssadzfzfxcufxvijlt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsc3NhZHpmemZ4Y3VmeHZpamx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzNzEzODcsImV4cCI6MjA0Njk0NzM4N30.UNXzMbLvruACs5RdXp_Vy9N5ZPKkASbZlb41KnpcUu0';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
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
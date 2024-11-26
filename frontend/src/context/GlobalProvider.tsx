import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

//Define the type for user info
interface UserInfo {
  id: string;
  updated_at: any;
  username: string;
  avatar_url: string;
  email: string;
  bio: string;
  fitness_level: number;
}

// Define the type for the context state
interface AppContextState {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  // session: any | null; // Define a more specific type if you know the shape of the session object
  // setSession: (session: any | null) => void;
}

// create our context
const GlobalContext = createContext<AppContextState | undefined>(undefined);

export const GlobalProvider = ({children}:{children:JSX.Element}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const [session, setSession] = useState(false);

  // get our current user if there is one logged in already
  const fetchSession = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    console.log('Session: ', session)

    if(session){
      // setSession(session);
      setIsLoggedIn(true);

      const { data: userData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if(error)
        return alert(error.message);

      setUser(userData || null);
    }
    setIsLoading(false);
  }

  //each time we load app, see if user is logged in
  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <GlobalContext.Provider 
      value={{ 
        user, setUser,
        isLoggedIn, setIsLoggedIn,
        isLoading, setIsLoading,
      }}
    >
        {children}
    </GlobalContext.Provider>
  )
}

// Hook for accessing the context 
export const useGlobalContext = (): AppContextState => {
  const context = useContext(GlobalContext);
  if(!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider")
  return context;
}

export default GlobalProvider;

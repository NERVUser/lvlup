import React, { createContext, useContext, useState, ReactNode } from 'react';

// //Define the type for user info
// interface UserInfo {
//   id: string;
//   updated_at: any;
//   username: string;
//   avatar_url: string;
//   email: string;
//   bio: string;
//   fitness_level: number;
// }

// // Define the type for the context state
// interface AppContextState {
//   user: UserInfo | null;
//   setUser: (user: UserInfo | null) => void;
//   isLoggedIn: boolean;
//   setIsLoggedIn: (isLoggedIn: boolean) => void;
//   isLoading: boolean;
//   setIsLoading: (isLoading: boolean) => void;
//   session: any | null; // Define a more specific type if you know the shape of the session object
//   setSession: (session: any | null) => void;
// }

// const GlobalContext = createContext<AppContextState | undefined>(undefined);

// export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [user, setUser] = useState<UserInfo | null>(null);
//   const [session, setSession] = useState<any | null>(null);

//   return (
//     <GlobalContext.Provider value={{ user }}>{children}</GlobalContext.Provider>
//   )
// };

// // Hook for accessing the context 
// export const useGlobalContext = (): AppContextState => {
//   const context = useContext(GlobalContext);
//   if(!context)
//     throw new Error("useGlobalContext must be used within a GlobalProvider")
//   return context;
// }

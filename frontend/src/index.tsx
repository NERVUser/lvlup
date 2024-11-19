import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './Singup/Signup';
import Login from './Login/Login';
import Home from './Home/Home';
import Feedpage from './Feedpage/Feedpage'
import WorkoutJournal from './WorkoutJournal/WorkoutJournal'
import FoodJournal from './FoodJournal/FoodJournal'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AccountSetup from './AccountSetup/AccountSetup';
import SideNav from './SideNav/SideNav';

// Create a default MUI theme (you can customize this later if needed)
const theme = createTheme();

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex' }}>
      <SideNav />
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
    errorElement: <h1 style= {{color: "white"}}> 404 Not Found </h1>
  },
  {
    path: '/Signup',
    element: <Signup />,
  },
  {
    path: '/Login',
    element: <Login />,
  },
  {
    path: '/Feedpage',
    element: <Layout><Feedpage /></Layout>,
  },
  {
    path: '/WorkoutJournal',
    element: <Layout><WorkoutJournal /></Layout>,
  },
  {
    path: '/FoodJournal',
    element: <Layout><FoodJournal /></Layout>,
  },
  {
    path: '/AccountSetup',
    element: <Layout><AccountSetup /></Layout>
  }, 
]);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  </React.StrictMode>
);
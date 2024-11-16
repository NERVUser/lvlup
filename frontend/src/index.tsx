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

// Create a default MUI theme (you can customize this later if needed)
const theme = createTheme();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
    element: <Feedpage />,
  },
  {
    path: '/Feedpage',
    element: <Feedpage />,
  },
  {
    path: '/WorkoutJournal',
    element: <WorkoutJournal />,
  },
  {
    path: '/FoodJournal',
    element: <FoodJournal />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import FoodJournal from './FoodJournal';
import Signup from './Signup';
import Login from './Login';
import WorkoutJournal from './WorkoutJournal';
//import Home from './Home';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import QueryProvider from '../context/QueryProvider';

// Create a default MUI theme (you can customize this later if needed)
const theme = createTheme();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryProvider>
      <WorkoutJournal />
    </QueryProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
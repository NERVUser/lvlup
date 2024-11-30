import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Singup/Signup';
import Login from './Login/Login';
import Home from './Home/Home';
import Feedpage from './Feedpage/Feedpage'
import WorkoutJournal from './WorkoutJournal/WorkoutJournal'
import FoodJournal from './FoodJournal/FoodJournal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AccountSetup from './AccountSetup/AccountSetup';
import SideNav from './SideNav/SideNav';
import PrivateRoutes from './utils/PrivateRoutes';
import GlobalProvider from './context/GlobalProvider';
import RecommendationsPage from './Recommendations/Recommendations';
import LeaderboardStream from './LeaderboardStream/LeaderboardStream';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{display: 'flex'}}>
      <SideNav />
      <div style={{flex: 1}}>
        {children}
      </div>
    </div>
  )
}

// put this somewhere later
// errorElement: <h1 style= {{color: "white"}}> 404 Not Found </h1>

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<Home />} path='/'/>
            <Route element={<Login />} path='/login' />
            <Route element={<Signup />} path='/signup' />

            <Route element={<PrivateRoutes />}>
              <Route element={<Layout><Feedpage /></Layout>} path='/feedpage' />
              <Route element={<Layout><WorkoutJournal /></Layout>} path='/workoutjournal' />
              <Route element={<Layout><FoodJournal /></Layout>} path='/foodjournal' />
              <Route element={<Layout><AccountSetup /></Layout>} path='/accountsetup' />
              <Route element={<Layout><RecommendationsPage /></Layout>} path='/recommendations' />
              <Route element={<Layout><LeaderboardStream leaderboardData={[]} /></Layout>} path='/Leaderboards' />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </GlobalProvider>
  </React.StrictMode>
);
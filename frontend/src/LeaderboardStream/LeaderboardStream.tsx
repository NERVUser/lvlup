import React, { useState, useEffect } from "react";
import "./LeaderboardStream.css";
import {
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Checkbox,
  Avatar,
  Grid,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useGlobalContext } from "../context/GlobalProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase, useGetAllUsers, useGetUserExercises } from "../lib/supabase";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO, format, add } from 'date-fns';

interface LeaderboardProps {
  leaderboardData: {
    id: number;
    name: string;
    score: number;
    date: string;
    liftType: 'Squat' | 'Deadlift' | 'Bench';
    caloriesBurned: number;
  }[];
}

interface Challenge {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

type ExerciseProp = {
  created_at: string;
  name: string;
  weight: number;
  reps: number;
  sets: number;
  workout_id: string;
  duration: number;
  calories_burned: number
  user_id: string;
}

type UserExerciseTotals = {
  fullName: string;
  totalCalories: number;
  totalWeight: number;
};

type ExercisesByUser = {
  [userId: string]: UserExerciseTotals;
};

interface UserExercises {
  userId: string;
  fullName: string;
  totalCalories: number;
  totalWeight: number;
}

const LeaderboardStream: React.FC<LeaderboardProps> = () => {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [timeSelection, setTimeSelection] = useState<'today' | 'week' | 'month'>('today');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [liftFilter, setLiftFilter] = useState<'Squat' | 'Deadlift' | 'Bench' | 'All'>('All');
  const [displayOption, setDisplayOption] = useState<'Calories' | 'Weights'>('Calories');
  const [tabValue, setTabValue] = useState<'leaderboard' | 'challenges'>('leaderboard');
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, name: "Workweek Hustle", description: "Get the most steps between Monday and Friday.", completed: false },
    { id: 2, name: "Daily Streak", description: "Exercise every day for a week.", completed: false },
    { id: 3, name: "10K Steps Challenge", description: "Achieve 10,000 steps in a day.", completed: false },
  ]);


  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: allUsers, isLoading: usersLoading } = useGetAllUsers();
  
  // this is used to set total weight and calories burned for each user
  const [userExercises, setUserExercises] = useState<UserExercises[]>([]);
  const [sortedUsers, setSortedUsers] = useState<UserExercises[] | null>(null);

  useEffect(() => {
    if(!usersLoading && allUsers)
      fetchAllUserExercises();
  }, [allUsers, usersLoading, timeSelection]);

  // this hook is called each time our display options change, it sorts users based on the display option
  useEffect(() => {
    // sort our userExercises by the display option and then display it
    const tempSortedUsers = [...userExercises].sort((a, b) => 
      displayOption === 'Calories'
        ? b.totalCalories - a.totalCalories 
        : b.totalWeight - a.totalWeight
    );

    setSortedUsers(tempSortedUsers);
  }, [userExercises, displayOption, timeSelection])

  // get a user's exercise based on their id
  const fetchUserExercises = async (id: string) => {
    const { error, data } = await supabase
      .from('exercises')
      .select('*')
      .eq('user_id', id);
  
    if (error) throw new Error(error.message);
  
    return data;
  };

  // Function to get the date range based on the selected time frame
  const getDateRange = (timeFrame: 'today' | 'week' | 'month') => {
    let start, end;
    switch (timeFrame) {
      case 'week':
        start = startOfWeek(new Date());
        end = endOfWeek(new Date());
        return { start, end }
      case 'month':
        start = startOfMonth(new Date());
        end = endOfMonth(new Date());
        return { start, end }
      default:
        return { start: new Date(), end: new Date() };
    }
  };

  // Function to filter exercises by the selected time frame
  const filterExercisesByTimeframe = (exercises: ExerciseProp[], timeFrame: 'today' | 'week' | 'month') => {
    return exercises.filter(exercise => {
      
      // if selection is today, just return a comparison
      if(timeFrame === 'today')
        return exercise.created_at == format(new Date(), 'yyyy-MM-dd');

      // otherwise, we'll get the appropriate range and make our comparison
      const { start, end } = getDateRange(timeFrame);
  
      // parse the created_at date
      const date = parseISO(exercise.created_at);
      return isWithinInterval(date, { start, end });
        
    });
  };

  const fetchAllUserExercises = async () => {
    setIsLoading(true);
    
    if(allUsers){
      const results = await Promise.all(
        allUsers.map(async (profile: { id: string, full_name: string, created_at: string }) => {
          const exercises = await fetchUserExercises(profile.id);
          // now filter our exercises by our selected time frame
          const filteredExercises = filterExercisesByTimeframe(exercises, timeSelection);
          
          return { userId: profile.id, fullName: profile.full_name, exercises: filteredExercises };
        })
      );

      // Transform results into a keyed object for easier access
      const exercisesByUser = results.reduce<ExercisesByUser>((acc, { userId, fullName, exercises }) => {
        const totals = exercises.reduce(
          (sum, exercise: { calories_burned: number; weight: number }) => {
            sum.totalCalories += exercise.calories_burned;
            sum.totalWeight += exercise.weight;
            return sum;
          },
          { totalCalories: 0, totalWeight: 0 } // Initial cumulative values
        );
      
        acc[userId] = { ...totals, fullName };  // Include full name here
        return acc;
      }, {});

      // convert our exercises by User object into an array
      const userExercisesArray = Object.entries(exercisesByUser).map(([userId, { fullName, totalCalories, totalWeight }]) => ({
        userId,
        fullName,
        totalCalories,
        totalWeight,
      }));
  
      setUserExercises(userExercisesArray);
    }

    setIsLoading(false);
  };

  const handleFilterChange = (newFilter: 'today' | 'week' | 'month') => {
    setTimeSelection(newFilter);
  };

  const handleMenuClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDisplayOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayOption(event.target.value as 'Calories' | 'Weights');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'leaderboard' | 'challenges') => {
    setTabValue(newValue);
  };

  const handleChallengeCompletion = (challengeId: number) => {
    setChallenges((prevChallenges) =>
      prevChallenges.map((challenge) =>
        challenge.id === challengeId ? { ...challenge, completed: !challenge.completed } : challenge
      )
    );
  };

  return (
    <div className="LeaderboardContainer">
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ marginBottom: 3 }}>
        <Tab label="Leaderboard" value="leaderboard" />
        <Tab label="Challenges" value="challenges" />
      </Tabs>
      {tabValue === 'leaderboard' && (
        <div>
          <div className="Title">
            <h1>Leaderboard</h1>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon sx={{ color: 'white' }}/>
            </IconButton>
            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
              <DialogTitle>Filters</DialogTitle>
              <DialogContent>
                <FormControl component="fieldset" style={{ marginBottom: '1rem' }}>
                  <FormLabel component="legend">Display Option</FormLabel>
                  <RadioGroup
                    name="displayOption"
                    value={displayOption}
                    onChange={handleDisplayOptionChange}
                  >
                    <FormControlLabel value="Calories" control={<Radio />} label="Calories Burned" />
                    <FormControlLabel value="Weights" control={<Radio />} label="Weights Lifted" />
                  </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" style={{ marginBottom: '1rem' }}>
                  <FormLabel component="legend">Time Filter</FormLabel>
                  <RadioGroup
                    name="timeFilter"
                    value={timeSelection}
                    onChange={(e) => handleFilterChange(e.target.value as 'today' | 'week' | 'month')}
                  >
                    <FormControlLabel value="today" control={<Radio />} label="Today" />
                    <FormControlLabel value="week" control={<Radio />} label="Week" />
                    <FormControlLabel value="month" control={<Radio />} label="Month" />
                  </RadioGroup>
                </FormControl>
                <Button onClick={handleDialogClose} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
                  Apply Filters
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <div className="Scores">
            <Grid container spacing={2} className="LeaderboardGrid">
              {sortedUsers?.map((user, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    display="flex"
                    alignItems="center"
                    p={2}
                    bgcolor="#2d2d2d"
                    borderRadius={2}
                    boxShadow={2}
                  >
                    <Typography
                      variant="h5"
                      component="div"
                      style={{ width: '3rem', color: '#ffeb3b', fontWeight: 'bold' }}
                    >
                      {index + 1}
                    </Typography>
                    {/* <Avatar style={{ marginRight: '1rem' }}>{user.userId[0].toUpperCase()}</Avatar> */}
                    <Box flexGrow={1}>
                      <Typography variant="h6" style={{ color: '#f0f0f0' }}>
                        {user.fullName}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h5"
                      color="black"
                    >
                      {displayOption === 'Calories'
                        ? `${user.totalCalories} cal`
                        : `${user.totalWeight} lbs`}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      )}
      {tabValue === 'challenges' && (
        <div className="ChallengesContainer">
          <Typography variant="h5" gutterBottom>Challenges</Typography>
          {challenges.map((challenge) => (
            <Box key={challenge.id} display="flex" alignItems="center" mb={2} p={2} bgcolor="#2d2d2d" borderRadius={2} boxShadow={2}>
              <Checkbox
                checked={challenge.completed}
                onChange={() => handleChallengeCompletion(challenge.id)}
                style={{ color: '#ffeb3b' }}
              />
              <Box>
                <Typography variant="subtitle1" component="div" style={{ color: '#f0f0f0' }}>
                  {challenge.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {challenge.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default LeaderboardStream;

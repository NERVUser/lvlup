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
import { logOut, useGetAllUsers } from "../lib/supabase";

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

const LeaderboardStream: React.FC<LeaderboardProps> = ({ leaderboardData = [] }) => {

  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [liftFilter, setLiftFilter] = useState<'Squat' | 'Deadlift' | 'Bench' | 'All'>('All');
  const [displayOption, setDisplayOption] = useState<'Calories' | 'Weights'>('Calories');
  const [filteredLeaderboardData, setFilteredLeaderboardData] = useState(leaderboardData);
  const [tabValue, setTabValue] = useState<'leaderboard' | 'challenges'>('leaderboard');
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, name: "Workweek Hustle", description: "Get the most steps between Monday and Friday.", completed: false },
    { id: 2, name: "Daily Streak", description: "Exercise every day for a week.", completed: false },
    { id: 3, name: "10K Steps Challenge", description: "Achieve 10,000 steps in a day.", completed: false },
  ]);


  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: allUsers } = useGetAllUsers();
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Week starts on Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const updatedLeaderboardData = leaderboardData.filter((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      const dateMatches = (() => {
        switch (filter) {
          case 'day':
            return entryDate.getTime() === today.getTime();
          case 'week':
            return entryDate >= startOfWeek && entryDate <= today;
          case 'month':
            return entryDate >= startOfMonth && entryDate <= today;
          default:
            return true;
        }
      })();
      const liftMatches = liftFilter === 'All' || entry.liftType === liftFilter;
      return dateMatches && liftMatches;
    }).reduce((acc, entry) => {
      const existingEntry = acc.find(e => e.name === entry.name);
      if (existingEntry) {
        existingEntry.score += entry.score;
        existingEntry.caloriesBurned += entry.caloriesBurned;
      } else {
        acc.push({ ...entry });
      }
      return acc;
    }, [] as typeof leaderboardData);

    setFilteredLeaderboardData(updatedLeaderboardData);
  }, [filter, liftFilter, leaderboardData]);

  const handleFilterChange = (newFilter: 'day' | 'week' | 'month') => {
    setFilter(newFilter);
  };

  const handleMenuClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleLiftFilterChange = (lift: 'Squat' | 'Deadlift' | 'Bench' | 'All') => {
    setLiftFilter(lift);
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
                    value={filter}
                    onChange={(e) => handleFilterChange(e.target.value as 'day' | 'week' | 'month')}
                  >
                    <FormControlLabel value="day" control={<Radio />} label="Day" />
                    <FormControlLabel value="week" control={<Radio />} label="Week" />
                    <FormControlLabel value="month" control={<Radio />} label="Month" />
                  </RadioGroup>
                </FormControl>
                {displayOption === 'Weights' && (
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Lift Type</FormLabel>
                    <RadioGroup
                      name="liftFilter"
                      value={liftFilter}
                      onChange={(e) => handleLiftFilterChange(e.target.value as 'Squat' | 'Deadlift' | 'Bench' | 'All')}
                    >
                      <FormControlLabel value="Squat" control={<Radio />} label="Squat" />
                      <FormControlLabel value="Deadlift" control={<Radio />} label="Deadlift" />
                      <FormControlLabel value="Bench" control={<Radio />} label="Bench" />
                      <FormControlLabel value="All" control={<Radio />} label="All Lifts" />
                    </RadioGroup>
                  </FormControl>
                )}
                <Button onClick={handleDialogClose} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
                  Apply Filters
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <div className="Scores">
            <Grid container spacing={2} className="LeaderboardGrid">
              {filteredLeaderboardData.sort((a, b) => b.score - a.score).map((entry, index) => (
                <Grid item xs={12} key={entry.id} className="LeaderboardItem">
                  <Box display="flex" alignItems="center" p={2} bgcolor="#2d2d2d" borderRadius={2} boxShadow={2}>
                    <Typography variant="h5" component="div" style={{ width: '3rem', color: '#ffeb3b', fontWeight: 'bold' }}>
                      {index + 1}
                    </Typography>
                    <Avatar style={{ marginRight: '1rem' }}>P</Avatar> {/* Placeholder avatar, replace 'P' with user profile pic */}
                    <Box flexGrow={1}>
                      <Typography variant="h6" style={{ color: '#f0f0f0' }}>{entry.name}</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((entry.score / 100) * 100, 100)}
                        color="primary"
                        style={{ marginTop: '0.5rem' }}
                      />
                    </Box>
                    <Typography variant="h6" style={{ color: '#ffeb3b', fontWeight: 'bold', marginLeft: '1rem' }}>
                      {displayOption === 'Calories' ? `${entry.caloriesBurned} kcal` : `${entry.score} lbs`}
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

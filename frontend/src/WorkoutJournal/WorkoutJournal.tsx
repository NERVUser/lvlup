import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    IconButton,
    Box,
    DialogContentText,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './WorkoutJournal.css';
import { useAddUserWeight, useGetUserWeights, useGetUserWorkouts } from '../lib/supabase';
import { useGlobalContext } from '../context/GlobalProvider';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO, format, add } from 'date-fns';
import FetchedWorkoutComponent from '../components/FetchedWorkoutComponent';

interface UserWeight {
    id: number;
    created_at: string;
    weight: number;
    user_id: string;
}

type WeeklyDataPoint = {
  dayOfWeek: string;
  avgWeight: number;
};

interface FetchedWorkout {
  name: string;
  calories_per_hour: number;
  duration_minutes: number;
  total_calories: number;
}

const fetchedWorkouts: FetchedWorkout[] | null = [];

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WorkoutJournal = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [newWeight, setNewWeight] = useState(0);
    const [calories, setCalories] = useState<number | null>(null);
    const [time, setTime] = useState<number | null>(null);
    const [addExerciseForm, setAddExerciseForm] = useState({
      exerciseName: '',
      duration: 60,
      caloriesBurned: 0,
      exerciseSets: 0,
      exerciseReps: 0,
      exerciseWeight: 0
    })
    const [fetchedWorkouts, setFetchedWorkouts] = useState<FetchedWorkout[] | null>(null);
    const [toggledWorkoutType, setToggledWorkoutType] = useState('search')
    const [exercises, setExercises] = useState<{ name: string; sets: string }[]>([]);
    const [exerciseName, setExerciseName] = useState('');
    const [exerciseSets, setExerciseSets] = useState('');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    
    // grab our user, and then using his id, get all weights on the backend associated with that user
    const { user } = useGlobalContext();
    const { data: userWeights } = useGetUserWeights(user?.id) as { data: UserWeight[] | undefined};
    const { data: userWorkouts } = useGetUserWorkouts(user?.id);
    const { mutate: addWeight } = useAddUserWeight();
    // const [monthlyData, setMonthlyData] = useState<WeeklyDataPoint[]>(null);
    
    const [addWeightDialog, setAddWeightDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editWorkoutDialogOpen, setEditWorkoutDialogOpen] = useState(false);

    useEffect(() => {
      if(userWeights) {
        const monthlyData = filterDataForCurrentMonth(userWeights);
        // setMonthlyData(monthlyData);
      }
    }, [userWeights]);

    useEffect(() => {
        const fetchWorkoutData = async () => {
            if (selectedDate) {
                const dateKey = selectedDate.toISOString().split('T')[0];
                try {
                    const response = await axios.get(`/api/workouts/${dateKey}`);
                    if (response.data) {
                        setCalories(response.data.calories);
                        setTime(response.data.time);
                        setExercises(response.data.exercises);
                    } else {
                        setCalories(null);
                        setTime(null);
                        setExercises([]);
                    }
                } catch (error) {
                    console.error("Error fetching workout data:", error);
                }
            }
        };
        fetchWorkoutData();
    }, [selectedDate]);

    const calorieGoal = 1000; // Set the new calorie goal for 1 loop
    const caloriePercentage = calories ? (calories >= calorieGoal ? 100 : (calories / calorieGoal) * 100) : 0;
    const progressColor = calories && calories >= calorieGoal ? 'success' : 'primary';
    
    const handleCancelWeightDialog = () => {
      setNewWeight(0);
      setAddWeightDialog(false);
    }
    const handleAddWeight = () => {
      if(!newWeight || newWeight === 0)
        return alert("Please enter your weight")

      addWeight({
        user_id: user?.id,
        weight: newWeight
      }, {
        onSuccess: () => {
          setNewWeight(0);
          setAddWeightDialog(false);
        }
      })
    }

    const handleAddWorkout = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const fetchWorkout = async (activity: string, duration: number) => {
      let fixedDuration = duration;
      // set default weight to 160, and then change it if user has a weight
      let newWeight = 160;
      // set our duration to 60 if not > 1
      if(fixedDuration <= 1)
        fixedDuration = 60;

      //fetch the current weight of the user if available
      if(userWeights && userWeights.length > 0)
        newWeight = userWeights[userWeights.length - 1].weight;

      const apiKey = 'NxUluHVadxEpPioUZ9fAOA==tUBsDWBDZoHNLsbh';
                     
      try {
        const response = await fetch(
          `https://api.api-ninjas.com/v1/caloriesburned?activity=${activity}&duration=${fixedDuration}&weight=${newWeight}`,
          {
            method: 'GET',
            headers: {
              'X-Api-Key': apiKey,
            },
          }
        );

        if(!response.ok)
          return console.log('Error:', response.status, await response.text());
        
        const data = await response.json();
        console.log(data);
        setFetchedWorkouts(data);
        
      } catch (error) {
        console.log("Error", error)
      }
    }

    const handleAddExercise = () => {
        if (exerciseName.trim() !== '' && exerciseSets.trim() !== '') {
            setExercises([...exercises, { name: exerciseName, sets: exerciseSets }]);
            setExerciseName('');
            setExerciseSets('');
        }
    };

    const handleSaveWorkout = async () => {
        if (calories !== null && time !== null) {
            handleAddExercise();
            const dateKey = selectedDate?.toISOString().split('T')[0];
            if (dateKey) {
                try {
                    await axios.post(`/api/workouts/${dateKey}`, {
                        date: dateKey,
                        calories,
                        time,
                        exercises,
                    });
                    // Optionally, update the local state after saving to reflect new data
                } catch (error) {
                    console.error("Error saving workout data:", error);
                }
            }
        }
        setOpenDialog(false);
    };

    const handleEditExercise = (index: number) => {
        setEditIndex(index);
        setExerciseName(exercises[index].name);
        setExerciseSets(exercises[index].sets);
        setEditDialogOpen(true);
    };

    const handleSaveEditExercise = () => {
        if (editIndex !== null) {
            const updatedExercises = [...exercises];
            updatedExercises[editIndex] = { name: exerciseName, sets: exerciseSets };
            setExercises(updatedExercises);
            setEditIndex(null);
            setExerciseName('');
            setExerciseSets('');
            setEditDialogOpen(false);
        }
    };

    const handleDeleteExercise = (index: number) => {
        const updatedExercises = exercises.filter((_, i) => i !== index);
        setExercises(updatedExercises);
        if (updatedExercises.length === 0) {
            setCalories(null);
            setTime(null);
        }
    };

    const handleEditWorkout = () => {
        setEditWorkoutDialogOpen(true);
    };

    const handleSaveEditWorkout = async () => {
        if (selectedDate) {
            const dateKey = selectedDate.toISOString().split('T')[0];
            if (dateKey) {
                try {
                    await axios.post(`/api/workouts/${dateKey}`, {
                        date: dateKey,
                        calories: calories || 0,
                        time: time || 0,
                        exercises,
                    });
                } catch (error) {
                    console.error("Error saving workout data:", error);
                }
            }
        }
        setEditWorkoutDialogOpen(false);
    };

    // filters the data for the current month
    const filterDataForCurrentMonth = (userWeights: UserWeight[]): WeeklyDataPoint[] => {
      // Get the start and end of the current month
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
    
      // Create an object to group weights by month
      const groupedData: { [key: string]: number[] } = {};
    
      // Loop through the weights and filter by the current month
      userWeights.forEach((weight) => {
        // Parse the created_at date
        const date = parseISO(weight.created_at);
    
        // Check if the weight's date is within the current month
        if (isWithinInterval(date, { start, end })) {
          // Get the month and year (e.g., "November 2024")
          const monthYear = format(date, 'MMMM yyyy'); // e.g., "November 2024"
    
          // Group weights by month-year
          if (groupedData[monthYear]) {
            groupedData[monthYear].push(weight.weight);
          } else {
            groupedData[monthYear] = [weight.weight];
          }
        }
      });
    
      // Calculate the average weight for each month
      const monthlyData: WeeklyDataPoint[] = Object.keys(groupedData).map((month) => {
        const weights = groupedData[month];
        const avgWeight = weights.reduce((acc, weight) => acc + weight, 0) / weights.length;
        return { dayOfWeek: month, avgWeight };  // "dayOfWeek" is misleading here, maybe rename it to "month"
      });
    
      return monthlyData;
    };

    // this component creates the chart for the user's average weights througout the week
    const WeeklyDataChart = ({ userWeights }: { userWeights: UserWeight[] | undefined }) => {
      const [chartData, setChartData] = useState<any>(null);

      useEffect(() => {
        if(userWeights) {
          // get the start and end of the current week
          const start = startOfWeek(new Date());
          const end = endOfWeek(new Date());

          //group weights by day of the week
          const groupedData: { [key: string]: number[] } = {};

          userWeights.forEach((weight) => {
            // parse the created_at date
            const date = parseISO(weight.created_at);

            // check if the weight's date is within the current week
            if(isWithinInterval(date, { start, end })) {
              // get the day of the week
              const dayOfWeek = format(date, 'iiii'); // gets day of week (e.g. Monday)
  
              if(groupedData[dayOfWeek])
                groupedData[dayOfWeek].push(weight.weight);
              else
                groupedData[dayOfWeek] = [weight.weight];
            }
          });

          // Calculate the average weight for each day of the week
          const weeklyData: WeeklyDataPoint[] = Object.keys(groupedData).map((day) => {
            const weights = groupedData[day];
            const avgWeight = weights.reduce((acc, weight) => acc + weight, 0) / weights.length;
            return { dayOfWeek: day, avgWeight };
          });

          // sort by the days of the week in the correct order
          const sortedData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
            const dataPoint = weeklyData.find((point) => point.dayOfWeek === day);
            return dataPoint ? dataPoint.avgWeight : 0;
          });

          // now we set the chart data
          setChartData({
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: [
              {
                label: 'Average Weight',
                data: sortedData,
                borderColor: 'rgba(75, 192, 192, 1)',
                // backgroundColor: 'rgba(75, 192, 192, 0.2',
                fill: false,
              },
            ],
          });
        }
      }, [userWeights])

      // options for our line chart
      const options: ChartOptions<'line'> = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Weight Data for Current Week',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Day',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Weight (lbs)',
            },
            beginAtZero: true,
          },
        },
      };

      // if we have no points, just return this
      if(!chartData)
        return <div>Loading...</div>;

      return <Line data={chartData} options={options} />;
    }

    // this component creates the chart for the user's average weights throughout the month
    const MonthlyDataChart = () => {

    }
    
    return (
      <div className="workout-journal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Top-Left: Date Calendar */}
        <Card>
          <CardContent>
            <Typography variant="h6">Select Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateCalendar value={selectedDate} onChange={(newDate) => setSelectedDate(newDate)} />
            </LocalizationProvider>
          </CardContent>
        </Card>

        {/* Top-Right: Weight Progress Graph */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Weight Progress</Typography>
              <Button variant='contained' onClick={() => setAddWeightDialog(true)}>Add Weight</Button>
            </Box>
            <WeeklyDataChart userWeights={userWeights} />
          </CardContent>
        </Card>

        {/* Bottom-Left: Exercises List */}
        <Card>
          <CardContent>
            <Typography variant="h6">Exercises</Typography>
            <List className="exercise-list">
            {exercises.map((exercise, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={exercise.name} 
                  secondary={exercise.sets} 
                  primaryTypographyProps={{ style: { color: '#000000' } }} 
                  secondaryTypographyProps={{ style: { color: '#000000' } }} 
                />
                <IconButton aria-label="edit" onClick={() => handleEditExercise(index)}>
                <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => handleDeleteExercise(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
            </List>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: '20px' }}
                onClick={handleAddWorkout}
                >
                  Add Workout
              </Button>
          </CardContent>
        </Card>

          {/* Bottom-Right: Calories and Time */}
          <Card>
            <CardContent style={{ textAlign: 'center' }}>
              <Typography variant="h6">Today's Workout</Typography>
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={caloriePercentage}
                  size={100}
                  thickness={5}
                  color={progressColor}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                <Typography variant="h5">{calories !== null ? calories : 0}</Typography>
                <Typography variant="caption">Calories</Typography>
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Typography variant="h5">{time !== null ? time : 0} Minutes</Typography>
              </div>
              {calories !== null && time !== null && (
                <IconButton aria-label="edit" onClick={handleEditWorkout} style={{ marginTop: '10px' }}>
                  <EditIcon />
                </IconButton>
              )}
            </CardContent>
          </Card>

        {/* Add Weight Dialog */}
        <Dialog open={addWeightDialog} onClose={() => setAddWeightDialog(false)}>
          <DialogTitle>Add New Weight</DialogTitle>
          <DialogContent sx={{ marginInline: '12px'}}>
            <TextField
              label='New Weight'
              type='number'
              fullWidth
              margin='dense'
              value={newWeight}
              onChange={(e) => setNewWeight(parseFloat(e.target.value))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelWeightDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddWeight} color="primary" variant="contained">
              Save Workout
            </Button>
          </DialogActions>
        </Dialog>

        {/* Workout Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Search For a Workout</DialogTitle>
          <DialogTitle>Add Workout Details</DialogTitle>
          {toggledWorkoutType === 'search' ? (
            <DialogContent>
              <TextField
                label='Search for an exercise'
                type='text'
                fullWidth
                margin='dense'
                value={addExerciseForm.exerciseName}
                onChange={(e) => setAddExerciseForm({... addExerciseForm, exerciseName: e.target.value})}
              />
              <TextField
                label="Time Spent (minutes)"
                type="number"
                fullWidth
                margin="dense"
                value={addExerciseForm.duration}
                onChange={(e) => setAddExerciseForm({... addExerciseForm, duration: Number(e.target.value)})}
              />
              <Button variant='contained' onClick={() => fetchWorkout(addExerciseForm.exerciseName, addExerciseForm.duration)}>Search</Button>
            
              <List className="exercise-list">
                <Typography>Exercises</Typography>
                {fetchedWorkouts?.map((exercise: FetchedWorkout, index: number) => (
                  <FetchedWorkoutComponent key={index} exerciseName={exercise.name} caloriesBurned={exercise.total_calories} isSelected={false}/>
                ))}
              </List>
            </DialogContent>
          ) : (
            <DialogContent>
              <TextField
                label="Exercise Name"
                fullWidth
                margin="dense"
                value={addExerciseForm.exerciseName}
                onChange={(e) => setAddExerciseForm({... addExerciseForm, exerciseName: e.target.value})}
              />
              <TextField
                label="Time Spent (minutes)"
                type="number"
                fullWidth
                margin="dense"
                value={addExerciseForm.duration}
                onChange={(e) => setAddExerciseForm({... addExerciseForm, duration: Number(e.target.value)})}
              />
              <TextField
                label="Calories Burned"
                type="number"
                fullWidth
                margin="dense"
                value={addExerciseForm.caloriesBurned}
                onChange={(e) => setAddExerciseForm({... addExerciseForm, caloriesBurned: Number(e.target.value)})}
              />
              <Box sx={{ display: 'flex', gap: '12px' }}>
                <TextField
                  label="Sets"
                  fullWidth
                  margin="dense"
                  type='number'
                  value={addExerciseForm.exerciseSets}
                  onChange={(e) => setAddExerciseForm({... addExerciseForm, exerciseSets: Number(e.target.value)})}
                />
                <TextField
                  label="Reps"
                  fullWidth
                  margin="dense"
                  type='number'
                  value={addExerciseForm.exerciseSets}
                  onChange={(e) => setAddExerciseForm({... addExerciseForm, exerciseReps: Number(e.target.value)})}
                />
              </Box>
              <Button onClick={handleAddExercise} variant="outlined" color="primary" style={{ marginTop: '10px' }}>
                Add Exercise
              </Button>
            </DialogContent>
          )}
          

          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveWorkout} color="primary" variant="contained">
              Save Workout
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Exercise Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
            <DialogTitle>Edit Exercise</DialogTitle>
            <DialogContent>
                <TextField
                    label="Exercise Name"
                    fullWidth
                    margin="dense"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                />
                <TextField
                    label="Sets (e.g., 3x10)"
                    fullWidth
                    margin="dense"
                    value={exerciseSets}
                    onChange={(e) => setExerciseSets(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSaveEditExercise} color="primary" variant="contained">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>

        {/* Edit Workout Dialog */}
        <Dialog open={editWorkoutDialogOpen} onClose={() => setEditWorkoutDialogOpen(false)}>
            <DialogTitle>Edit Today's Workout</DialogTitle>
            <DialogContent>
                <TextField
                    label="Calories Burned"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={calories !== null ? calories : ''}
                    onChange={(e) => setCalories(Number(e.target.value))}
                />
                <TextField
                    label="Time Spent (minutes)"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={time !== null ? time : ''}
                    onChange={(e) => setTime(Number(e.target.value))}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setEditWorkoutDialogOpen(false)} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSaveEditWorkout} color="primary" variant="contained">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
};

export default WorkoutJournal;

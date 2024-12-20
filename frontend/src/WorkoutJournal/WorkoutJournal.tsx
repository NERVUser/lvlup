import React, { useState, useEffect } from 'react';
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
    Tabs,
    Tab,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import EditIcon from '@mui/icons-material/Edit';
import './WorkoutJournal.css';
import { useAddExercise, useAddUserWeight, useAddWorkout, useGetUserExercises, useGetUserWeights, useGetUserWorkouts, useGetWorkoutExercises } from '../lib/supabase';
import { useGlobalContext } from '../context/GlobalProvider';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO, format } from 'date-fns';
import FetchedWorkoutComponent from '../components/FetchedWorkoutComponent';
import ExerciseContainer from '../components/ExerciseContainer';
import EditExerciseDialog from '../components/EditExerciseDialog';
import WorkoutComponent from '../components/WorkoutComponent';

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

type ExerciseProp = {
  id: string;
  exerciseName: string;
  duration: number;
  calories_burned: number;
  exerciseSets: number;
  exerciseReps: number;
  exerciseWeight: number;
}

interface FetchedWorkout {
  name: string;
  calories_per_hour: number;
  duration_minutes: number;
  total_calories: number;
}

type WorkoutProp = {
  id: string;
  created_at: string;
  name: string;
  user_id: string;
}

// const fetchedWorkouts: FetchedWorkout[] | null = [];

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WorkoutJournal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [newWeight, setNewWeight] = useState(0);

    const [totalCalories, setTotalCalories] = useState<number | null>(0);
    const calorieGoal = 1000; // Set the new calorie goal for 1 loop
    const [totalCaloriesPercentage, setTotalCaloriesPercentage] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    const [newWorkoutName, setNewWorkoutName] = useState('');
    //stores all exercises locally that belong to particular workout
    const [exercises, setExercises] = useState<ExerciseProp []>([]);
    const [newExercises, setNewExercises] = useState<ExerciseProp[]>([]);
    // form for the current workout being inputted
    const [addExerciseForm, setAddExerciseForm] = useState({
      id: '',
      exerciseName: "",
      duration: 60,
      calories_burned: 0,
      exerciseSets: 0,
      exerciseReps: 0,
      exerciseWeight: 0
    })

    const [curWorkout, setCurWorkout] = useState<WorkoutProp | null>(null);
    const [fetchedWorkouts, setFetchedWorkouts] = useState<FetchedWorkout[] | null>(null);
    // used for all workouts that match selected date
    const [selectedWorkouts, setSelectedWorkouts] = useState<WorkoutProp[]>([]);
    
    // grab our user, and then using his id, get all weights on the backend associated with that user
    const { user } = useGlobalContext();
    const { data: userWeights } = useGetUserWeights(user?.id) as { data: UserWeight[] | undefined};
    const { data: userWorkouts } = useGetUserWorkouts(user?.id);
    const { data: userExercises } = useGetUserExercises(user?.id);

    // our tabs for adding workouts
    const [tabValue, setTabValue] = useState<'search' | 'manual'>('search');

    // mutations for adding new database entries
    const { mutate: addWeight } = useAddUserWeight();
    const { mutateAsync: addWorkout } = useAddWorkout();
    const { mutate: addExercise } = useAddExercise();

    const [addWeightDialog, setAddWeightDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseProp>({
      id: '',
      exerciseName: "",
      duration: 60,
      calories_burned: 0,
      exerciseSets: 0,
      exerciseReps: 0,
      exerciseWeight: 0
    });

    // this hook grabs all exercises for a particular workout
    // this gets called each time our current workout changes
    useEffect(() => {
      // if the user has existing workout and one of the workouts is today, set our current user workout to that
      if(userWorkouts) {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const todayWorkouts = userWorkouts.filter((workout) => workout.created_at === formattedDate);
        if(todayWorkouts)
          setCurWorkout(todayWorkouts[0]);
      }
      

    }, [curWorkout]);

    // need to recalculate total calories each time our date changes
    useEffect(() => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      if(userExercises) {
        //format our selected date first
        //filter our exercises and then compute our sums
        const filteredExercises = userExercises
          .filter((ex) => ex.created_at === formattedDate)
          .map((ex) => ({
            id: ex.id,
            exerciseName: ex.name,
            exerciseSets: ex.sets,
            exerciseReps: ex.reps,
            exerciseWeight: ex.weight,
            calories_burned: ex.calories_burned,
            duration: ex.duration,
          }));
          const totalCals = filteredExercises.reduce((total, ex) => total + ex.calories_burned, 0);
          const totalDuration = filteredExercises.reduce((total, ex) => total + ex.duration, 0);

        // now update our variables
        setExercises(filteredExercises);
        setTotalCalories(totalCals);
        setTotalDuration(totalDuration);
        const percentage = totalCals === 0 ? 0 : ((totalCals / calorieGoal) * 100)
        setTotalCaloriesPercentage(percentage);

      }

      // also filter our workouts for only those on the selected date
      if(userWorkouts) {
        const filteredWorkouts = userWorkouts.filter(ex => ex.created_at === formattedDate);
        setSelectedWorkouts(filteredWorkouts)

      }
    }, [selectedDate, userExercises, userWorkouts]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: 'search' | 'manual') => {
      setTabValue(newValue);
    };
    
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
    const handleCloseDialog = () => {
      // reset all fields and close our dialog
      setNewWorkoutName('');
      setAddExerciseForm({
        id: '',
        exerciseName: "",
        duration: 60,
        calories_burned: 0,
        exerciseSets: 0,
        exerciseReps: 0,
        exerciseWeight: 0
      })
      setNewExercises([]);
      setOpenDialog(false);
    }
      

    const fetchWorkout = async (activity: string, duration: number) => {
      setIsLoading(true);
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
        setFetchedWorkouts(data);
        
      } catch (error) {
        console.log("Error", error)
      } finally {
        setIsLoading(false);
      }
    }

    // this function adds a given exercise locally
    const handleAddExercise = (exercise: ExerciseProp) => {
      if(!exercise.exerciseName || !exercise.calories_burned || !exercise.duration)
        return alert("Please fill in all fields");

      // add our new exercise
      setNewExercises((prevExercises) => [...prevExercises, exercise]);

      //clear our form
      setAddExerciseForm({
        id: '',
        exerciseName: "",
        duration: 60,
        calories_burned: 0,
        exerciseSets: 0,
        exerciseReps: 0,
        exerciseWeight: 0
      })
      
    };

    // used for selecting a preset workout
    const handleExerciseItemClick = (name: string, burnedCalories: number, duration: number) => {
      // in this case, the workout and exercise name will be the same
      setNewWorkoutName(name);
      setAddExerciseForm(
        {...addExerciseForm,
          exerciseName: name,
          calories_burned: burnedCalories,
          duration: duration
        });
    }

    const handleSaveWorkout = async () => {
      // make sure that we have a workout name and exercises to add
      if(!newWorkoutName || !newExercises)
        return alert("Please fill in all fields");

      // no matter what, we will make 1 workout
      const newWorkout = await addWorkout({
        workoutName: newWorkoutName,
        user_id: user?.id,
        id: undefined
      })

      //handle a preset workout
      if(tabValue === 'search'){
        // if(!addExerciseForm.exerciseName)
        //   return alert("Please fill in exercise name");

        try {
          // now we need to add our exercise, use workout id from above
          addExercise({
            workout_id: newWorkout.id,
            user_id: user?.id,
            exerciseName: newWorkoutName,
            duration: addExerciseForm.duration,
            calories_burned: addExerciseForm.calories_burned,
            exerciseSets: undefined,
            exerciseReps: undefined,
            exerciseWeight: undefined,
          })

        } catch (error) {
          console.log("Error saving workout data:", error);
        }

      } else {
        //handle manually added exercises, which comprise of one workout
        //use the workout id from above when adding our exercises
        exercises.map(exercise => {
          addExercise({
            workout_id: newWorkout.id,
            user_id: user?.id,
            exerciseName: exercise.exerciseName,
            duration: exercise.duration,
            calories_burned: exercise.calories_burned,
            exerciseSets: exercise.exerciseSets,
            exerciseReps: exercise.exerciseReps,
            exerciseWeight: exercise.exerciseWeight,
          })
        })
      }

      // now reset our fields
      setAddExerciseForm({
        id: '',
        exerciseName: "",
        duration: 60,
        calories_burned: 0,
        exerciseSets: 0,
        exerciseReps: 0,
        exerciseWeight: 0
      })
      setNewExercises([]);
      setOpenDialog(false);
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
            <Typography variant="h6">Exercises on {format(selectedDate, 'MMM d, yyyy')}</Typography>
            {exercises.length > 0 ? (
              <List className="exercise-list">
                {exercises?.map((exercise, index) => (
                  <Box>
                    <ExerciseContainer
                      key={index}
                      exercise={exercise}
                      setExercises={setExercises}
                      toggleDialog={(open) => {
                        setEditDialogOpen(open);
                        setSelectedExercise(exercise);
                      }}
                    />
                    <EditExerciseDialog
                      editDialogOpen={editDialogOpen}
                      setEditDialogOpen={setEditDialogOpen}
                      exercise={selectedExercise}
                      setExercise={setSelectedExercise}
                    />
                  </Box>
                ))}
              </List>
            ) : (
              <Typography variant='h6' color='gray'>No exercises yet</Typography>
            )
            }
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
          <CardContent style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6">Workouts on {format(selectedDate, 'MMM d, yyyy')}</Typography>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={Math.min(totalCaloriesPercentage, 100)}
                size={100}
                thickness={5}
                color={totalCaloriesPercentage > 100 ? 'success' : 
                  totalCaloriesPercentage > 50 ? 
                  'warning' : 
                  'error'
                }
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
              <Typography variant="h5">{totalCalories !== null ? totalCalories : 0}</Typography>
              <Typography variant="caption">Calories</Typography>
            </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h5">{totalDuration} Minutes</Typography>
            </div>
            <List className='exercise-list'>
            {selectedWorkouts?.map((workout, index) => (
              <WorkoutComponent key={index} workout={workout}/>
            ))}
            </List>
            {/* {totalCalories !== null && totalDuration !== null && (
              <IconButton aria-label="edit" onClick={handleEditWorkout} style={{ marginTop: '10px' }}>
                <EditIcon />
              </IconButton>
            )} */}
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
              value={newWeight || ''}
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

        {/* Add Workout Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ marginTop: 3 }}>
            <Tab label='Search For a Workout' value='search'/>
            <Tab label='Add Workout Details' value='manual'/>
          </Tabs>
          {tabValue === 'search' && (
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
                value={addExerciseForm.duration || ''}
                onChange={(e) => setAddExerciseForm({... addExerciseForm, duration: Number(e.target.value)})}
              />
              <Box sx={{ width: '93px', display: 'flex', justifyContent: 'center' }}>
                {isLoading ? (
                  <CircularProgress size={36}/>
                ) : (
                  <Button variant='contained' onClick={() => fetchWorkout(addExerciseForm.exerciseName, addExerciseForm.duration)}>Search</Button>
                )}
              </Box>
            
              {fetchedWorkouts && <List className="exercise-list" sx={{ marginTop: '20px' }}>
                <Typography variant='h5' color='black'>Exercises</Typography>
                {fetchedWorkouts?.map((exercise: FetchedWorkout, index: number) => (
                  <FetchedWorkoutComponent 
                    key={index} 
                    selectedName={addExerciseForm.exerciseName} 
                    exerciseName={exercise.name} 
                    caloriesBurned={exercise.total_calories} 
                    duration={exercise.duration_minutes} 
                    handleClick={handleExerciseItemClick}
                  />
                ))}
              </List>}
            </DialogContent>
          )}
          {tabValue === 'manual' && (
            <DialogContent>
              <TextField
                label="Workout Name"
                fullWidth
                margin="dense"
                value={newWorkoutName}
                onChange={(e) => setNewWorkoutName(e.target.value)}
              />

              { /* Now we have our add exercise text inputs*/ }
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
                value={addExerciseForm.duration || ''}
                onChange={(e) => setAddExerciseForm({... addExerciseForm, duration: Number(e.target.value)})}
              />
              <TextField
                label="Calories Burned"
                type="number"
                fullWidth
                margin="dense"
                value={addExerciseForm.calories_burned || ""}
                onChange={(e) => setAddExerciseForm({... addExerciseForm, calories_burned: Number(e.target.value)})}
              />
              <Box sx={{ display: 'flex', gap: '12px' }}>
                <TextField
                  label="Sets"
                  fullWidth
                  margin="dense"
                  type='number'
                  value={addExerciseForm.exerciseSets || ''}
                  onChange={(e) => setAddExerciseForm({... addExerciseForm, exerciseSets: Number(e.target.value)})}
                />
                <TextField
                  label="Reps"
                  fullWidth
                  margin="dense"
                  type='number'
                  value={addExerciseForm.exerciseReps || ''}
                  onChange={(e) => setAddExerciseForm({... addExerciseForm, exerciseReps: Number(e.target.value)})}
                />
                <TextField
                  label="Weight"
                  fullWidth
                  margin="dense"
                  type='number'
                  value={addExerciseForm.exerciseWeight || ''}
                  onChange={(e) => setAddExerciseForm({... addExerciseForm, exerciseWeight: Number(e.target.value)})}
                />
              </Box>
              <Button onClick={() => handleAddExercise(addExerciseForm)} variant="outlined" color="primary" style={{ marginTop: '10px' }}>
                Add Exercise
              </Button>

              { /* list all exercises already filled out */ }
              {newExercises.length > 0 && 
                <List sx={{ marginTop: '20px' }}>
                  <Typography variant='h5' color='black'>Current Exercises</Typography>
                  {newExercises?.map((exercise, index: number) => (
                    <Box>
                      <ExerciseContainer
                        key={index}
                        exercise={exercise}
                        setExercises={setExercises}
                        toggleDialog={setEditDialogOpen}
                      />
                    </Box>
                  ))}
                </List>
              }
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
        
        

        {/* Edit Workout Dialog */}
      </div>
    );
};

export default WorkoutJournal;


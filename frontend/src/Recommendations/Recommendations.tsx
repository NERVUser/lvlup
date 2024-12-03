import React, { useEffect, useState } from 'react';
import './Recommendations.css';
import {
  Button,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  CircularProgress,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import ReccomendedExercise from '../components/ReccomendedExercise';
import ExerciseDialog from '../components/ExerciseDialog';
import { useAddExercise, useAddWorkout } from '../lib/supabase';
import { useGlobalContext } from '../context/GlobalProvider';

interface FetchedExercises {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
}

interface UploadExerciseProp {
  name: string;
  duration: number;
  calories_burned: number;
  sets: number;
  reps: number;
  weight: number;
}

const RecommendationsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<FetchedExercises[] | null>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const { user } = useGlobalContext();

  //mutation to add workout to backend
  const { mutateAsync: addWorkout } = useAddWorkout();
  const { mutate: addExercise } = useAddExercise();

  // these are used to actually upload a workout and its exercises
  const [workoutName, setWorkoutName] = useState('');
  const [exercisesToAdd, setExercisesToAdd] = useState<UploadExerciseProp[]>([]);

  // these get displayed as buttons on our page
  const muscleGroupLabels: string[] = ['Push', 'Pull', 'Legs']
  const muscleGroups: string[] = [
    'Chest',
    'Back',
    'Quadriceps',
    'Shoulders',
    'Biceps',
    'Hamstrings',
    'Triceps',
    'Abdominals',
    'Calves',
  ];

  // hook called everytime our dialog is open
  useEffect(() => {
    if(dialogOpen) {
      const updatedExercisesToAdd: UploadExerciseProp[] = [];

      selectedExercises.forEach(exercise => {
        const newExercise = {
          name: exercise,
          duration: 0,
          calories_burned: 0,
          sets: 0,
          reps: 0,
          weight: 0,
        }

        updatedExercisesToAdd.push(newExercise);
      })

      setExercisesToAdd(updatedExercisesToAdd);
    }
  }, [dialogOpen]);

  // hits our api to find all exercises belonging to a particular muscle group
  const handleGetRecommendations = async () => {

    setIsLoading(true);
    const apiKey = 'NxUluHVadxEpPioUZ9fAOA==tUBsDWBDZoHNLsbh';
    
    // for back, grab exercises for lats, lower_back, and middle_back
    try {
      if(selectedMuscle === 'Back'){
        const backMuscles = ['lats', 'lower_back', 'middle_back'];
        const result = [];

        for(const muscle of backMuscles) {
          const response = await fetch(
            `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`,
            {
              method: 'GET',
              headers: {
                'X-Api-Key': apiKey,
              },
            }
          );
          
          const data = await response.json();
          console.log('Muscle: ', muscle, ' Response: ', data);
          
          result.push(...data);
        }

        setRecommendations(result);

      } else {
        const response = await fetch(
          `https://api.api-ninjas.com/v1/exercises?muscle=${selectedMuscle}`,
          {
            method: 'GET',
            headers: {
              'X-Api-Key': apiKey,
            },
          }
        );

        if(!response?.ok)
          return console.log('Error:', response?.status, await response?.text());
        
        const data = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.log("Error", error)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWorkout = async () => {
    if(!workoutName || !exercisesToAdd)
      return alert("Please fill in all fields");

    // no matter what, we will make 1 workout
    const newWorkout = await addWorkout({
      workoutName: workoutName,
      user_id: user?.id,
      id: undefined
    })

    //add our exercises, which comprise of one workout
    //use the workout id from above when adding our exercises
    exercisesToAdd.map(exercise => {
      addExercise({
        workout_id: newWorkout.id,
        user_id: user?.id,
        exerciseName: exercise.name,
        duration: exercise.duration,
        calories_burned: exercise.calories_burned,
        exerciseSets: exercise.sets,
        exerciseReps: exercise.reps,
        exerciseWeight: exercise.weight,
      })
    })

    // now reset our fields
    setExercisesToAdd([]);
    setRecommendations([]);
    setDialogOpen(false);
  };

  return (
    <Container className="recommendations-container">
      <Typography variant="h4" className="title" gutterBottom>Recommendations</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', marginInline: '20px', marginBottom: '20px' }}>
        {muscleGroupLabels.map((label) => (
          <Typography variant='h4' sx={{ textDecorationLine: 'underline' }}>{label}</Typography>
        ))}
      </Box>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
        {muscleGroups.map((group) => (
          <Box key={group} width={{ xs: '100%', sm: '45%', md: '30%' }}>
            <Card sx={{ backgroundColor: selectedMuscle === group ? 'lightgray' : 'white', border: selectedMuscle === group ? 'solid 2px yellow' : '' }}>
              <CardActionArea onClick={() => setSelectedMuscle(group)}>
                <CardContent>
                  <Typography variant="h5" align="center">{group}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', marginBottom: 2, marginTop: 2, gap: 2 }}>
        <Box sx={{ width: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleGetRecommendations}
              className="get-recommendations-button"
              sx={{ paddingTop: '15px', paddingBottom: '15px' }}
            >
              Get Recommendations
            </Button>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
          className="get-recommendations-button"
          sx={{ paddingTop: '15px', paddingBottom: '15px' }}
        >
          Add Workout
        </Button>
      </Box>

      {/* Display all fetched reccomended exercises based on the muscle group */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-around' }}>
        <List>
          {recommendations?.map((rec, index) => (
            <ReccomendedExercise key={index} selectedExercises={selectedExercises} setSelectedExercises={setSelectedExercises} exercise={rec}/>
          ))}
        </List>
        <Box>
          <Typography variant='h4' color='white'>Your Selcted Exercises</Typography>
          <List>
            {selectedExercises?.map((exercise, index) => (
              <ListItem
              key={index}
              sx={{ 
                backgroundColor: 'white', 
                border: 'solid 2px black', 
                borderRadius: '10px', 
                marginBottm: '10px', 
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                padding: '15px'
              }}
            >
              <Typography variant='h5' color='black'>{exercise}</Typography>
            </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent>
          <Typography variant='h4' color='black' sx={{ marginBottom: 2 }}>Let's save your workout</Typography>
          <TextField 
            label="Workout Name"
            margin='dense'
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            fullWidth
          />
          <List>
            {exercisesToAdd.map((exercise, index) => (
              <ExerciseDialog key={index} exercise={exercise} setExercises={setExercisesToAdd}/>
            ))}
          </List>
        </DialogContent>

        {/* Save or cancel our workout */}
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveWorkout} color="primary" variant="contained">
            Save Workout
          </Button>
        </DialogActions>

      </Dialog>
    </Container>
  );
};

export default RecommendationsPage;

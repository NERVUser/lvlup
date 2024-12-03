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
  Snackbar,
  Tab,
  Tabs,
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
  const [workoutName, setWorkoutName] = useState('');
  const [exercisesToAdd, setExercisesToAdd] = useState<UploadExerciseProp[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user } = useGlobalContext();

  const { mutateAsync: addWorkout } = useAddWorkout();
  const { mutate: addExercise } = useAddExercise();

  const muscleGroupLabels: string[] = ['Push', 'Pull', 'Legs'];
  const muscleGroups: string[][] = [
    ['Chest', 'Shoulders', 'Triceps'],
    ['Back', 'Biceps'],
    ['Quadriceps', 'Hamstrings', 'Calves']
  ];

  useEffect(() => {
    if (dialogOpen) {
      const updatedExercisesToAdd: UploadExerciseProp[] = selectedExercises.map((exercise) => ({
        name: exercise,
        duration: 0,
        calories_burned: 0,
        sets: 0,
        reps: 0,
        weight: 0,
      }));
      setExercisesToAdd(updatedExercisesToAdd);
    }
  }, [dialogOpen]);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    const apiKey = 'NxUluHVadxEpPioUZ9fAOA==tUBsDWBDZoHNLsbh';
    try {
      const muscle = selectedMuscle;
      if (muscle) {
        const response = await fetch(
          `https://api.api-ninjas.com/v1/exercises?muscle=${muscle.toLowerCase()}`,
          { method: 'GET', headers: { 'X-Api-Key': apiKey } }
        );
        const data = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.log('Error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWorkout = async () => {
    if (!workoutName || !exercisesToAdd.length) return alert('Please fill in all fields');
    const newWorkout = await addWorkout({
      workoutName,
      user_id: user?.id,
      id: undefined,
    });
    exercisesToAdd.forEach((exercise) => {
      addExercise({
        workout_id: newWorkout.id,
        user_id: user?.id,
        exerciseName: exercise.name,
        duration: exercise.duration,
        calories_burned: exercise.calories_burned,
        exerciseSets: exercise.sets,
        exerciseReps: exercise.reps,
        exerciseWeight: exercise.weight,
      });
    });
    setExercisesToAdd([]);
    setRecommendations([]);
    setDialogOpen(false);
    setSuccessMessage('Workout saved successfully!');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setSelectedMuscle(null);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: '20px', backgroundColor: '#333', borderRadius: '10px', color: '#fff' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
        Workout Recommendations
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ marginBottom: 3 }}>
        {muscleGroupLabels.map((label, index) => (
          <Tab key={index} label={label} sx={{ color: '#fff' }} />
        ))}
      </Tabs>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
        {muscleGroups[tabIndex].map((group) => (
          <Card
            key={group}
            sx={{
              width: '220px',
              backgroundColor: selectedMuscle === group ? '#FFA726' : '#444',
              border: selectedMuscle === group ? 'solid 2px #FF9800' : 'solid 1px #666',
              borderRadius: '10px',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            <CardActionArea onClick={() => setSelectedMuscle(group)}>
              <CardContent>
                <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', color: '#fff' }}>
                  {group}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      <Box sx={{ display: 'flex', marginY: 3, gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetRecommendations}
          disabled={isLoading}
          sx={{
            minWidth: '200px',
            paddingY: '15px',
            fontWeight: 'bold',
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Get Recommendations'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
          sx={{
            minWidth: '200px',
            paddingY: '15px',
            fontWeight: 'bold',
          }}
        >
          Confirm Workout
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 4 }}>
        <List sx={{ maxWidth: '400px', bgcolor: '#333', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', color: '#ddd' }}>
          {recommendations?.map((rec, index) => (
            <ReccomendedExercise
              key={index}
              selectedExercises={selectedExercises}
              setSelectedExercises={setSelectedExercises}
              exercise={rec}
            />
          ))}
        </List>
        <Box sx={{ maxWidth: '400px', bgcolor: '#333', borderRadius: '10px', padding: 2, boxShadow: 1, color: '#fff' }}>
          <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
            Your Selected Exercises
          </Typography>
          <List>
            {selectedExercises?.map((exercise, index) => (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: '#555',
                  border: 'solid 1px #666',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                  {exercise}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent sx={{ bgcolor: '#333', color: '#fff' }}>
          <Typography variant="h5" sx={{ marginBottom: 2, color: '#ddd' }}>
            Confirm Your Workout
          </Typography>
          <TextField
            label="Workout Name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            fullWidth
            margin="dense"
            sx={{ input: { color: '#fff' }, label: { color: '#ddd' } }}
          />
          <List>
            {exercisesToAdd.map((exercise, index) => (
              <ExerciseDialog key={index} exercise={exercise} setExercises={setExercisesToAdd} />
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#333' }}>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveWorkout} color="primary" variant="contained">
            Confirm Workout
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
};

export default RecommendationsPage;

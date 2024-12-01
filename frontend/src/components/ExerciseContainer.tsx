import { ListItem, ListItemText, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditExerciseDialog from './EditExerciseDialog';
import { supabase, useDeleteExercise } from '../lib/supabase';
import { useEffect, useState } from 'react';

type ExerciseProp = {
  id: string;
  exerciseName: string;
  duration: number;
  calories_burned: number;
  exerciseSets: number;
  exerciseReps: number;
  exerciseWeight: number;
}

interface ExerciseContainerProp {
  key: number;
  exercise: ExerciseProp;
  setExercises: (e: ExerciseProp[]) => void;
  toggleDialog: (bool: boolean) => void;
}

function ExerciseContainer({ key, exercise, toggleDialog }: ExerciseContainerProp) {

  const [workoutId, setWorkoutId] = useState(undefined);
  const { mutate: deleteExercise } = useDeleteExercise();

  // this grabs the workout id for our exercise, 
  // will use this to find the number of exercises associated with a workout
  async function getExerciseWorkout () {
    const { data: workout } = await supabase
      .from('exercises')
      .select('workout_id')
      .eq('id', exercise.id)
      .single();

      setWorkoutId(workout?.workout_id);
  }

  useEffect(() => {
    getExerciseWorkout();
  }, []);

  function handleDeleteExercise () {
    
    try {
      deleteExercise({
        id: exercise.id,
        workout_id: workoutId
      })
    } catch (error) {
      alert(error);
    } finally {
      // toggleDialog;
    }
  }

  return (
    <ListItem
      key={key}
      sx={{ 
        backgroundColor: 'white',  
        marginBottom: '10px',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        border: 'solid 2px black',
        borderRadius: '10px'
      }}
    >
      <Box>
        <Typography variant='h6' color='black'>{exercise.exerciseName}</Typography>
        <Typography color='gray'>Calories Burned: {exercise.calories_burned}</Typography>
      </Box>
      <Box>
        {exercise.exerciseSets && exercise.exerciseReps && exercise.exerciseWeight && <Typography color='black'>
          {exercise.exerciseSets} x {exercise.exerciseReps}, {exercise.exerciseWeight} lbs
        </Typography>}
        <Typography color='gray'>Duration: {exercise.duration} min</Typography>
      </Box>
      <Box>
        <IconButton aria-label="edit" onClick={() => toggleDialog(true)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDeleteExercise}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </ListItem>
  )
}

export default ExerciseContainer
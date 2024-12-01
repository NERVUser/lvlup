import { ListItem, ListItemText, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditExerciseDialog from './EditExerciseDialog';
import { useDeleteExercise } from '../lib/supabase';

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

  const { mutate: deleteExercise } = useDeleteExercise();

  function handleDeleteExercise () {
    
    try {
      deleteExercise({
        id: exercise.id
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
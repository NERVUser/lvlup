import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useUpdateExercise } from '../lib/supabase';

type FormProps = {
  id: string;
  exerciseName: string;
  duration: number;
  calories_burned: number;
  exerciseSets: number;
  exerciseReps: number;
  exerciseWeight: number;
}

interface EditDialogProps {
  editDialogOpen: boolean;
  setEditDialogOpen: (newValue: boolean) => void;
  exercise: FormProps;
  setExercise: (e: FormProps) => void;
}

function EditExerciseDialog({ editDialogOpen, setEditDialogOpen, exercise, setExercise  }: EditDialogProps) {
  const { mutate: updateExercise } = useUpdateExercise();

  const [isLoading, setIsLoading] = useState(false);
  const [localForm, setLocalForm] = useState(exercise);

  useEffect(() => {
    setLocalForm(exercise);
  }, [exercise]);

  function handleSaveEditExercise () {
    setIsLoading(true);

    try {
      // update our exercise in the backend
      updateExercise({
        id: localForm.id,
        exerciseName: localForm.exerciseName,
        duration: localForm.duration,
        calories_burned: localForm.calories_burned,
        exerciseSets: localForm.exerciseSets,
        exerciseReps: localForm.exerciseReps,
        exerciseWeight: localForm.exerciseWeight,
      })

      setEditDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  // function handleDeleteExercise () {
  //   setIsLoading(true);
    
  //   try {
  //     deleteExercise({
  //       id: exerciseForm.id
  //     })
  //   } catch (error) {
  //     alert(error);
  //   }
  // }

  //reset our form and close our dialog
  function handleCancelDialog () {
    setEditDialogOpen(false);
    setLocalForm({
      id: '',
      exerciseName: "",
      duration: 60,
      calories_burned: 0,
      exerciseSets: 0,
      exerciseReps: 0,
      exerciseWeight: 0,
    })
  }

  function handleSaveEdit () {
    

    setEditDialogOpen(false);
  }

  return (
    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
      <DialogTitle>Edit Exercise</DialogTitle>
      <DialogContent>
      <TextField
        label="Exercise Name"
        fullWidth
        margin="dense"
        value={localForm.exerciseName}
        onChange={(e) => setLocalForm({... localForm, exerciseName: e.target.value})}
      />
      <TextField
        label="Time Spent (minutes)"
        type="number"
        fullWidth
        margin="dense"
        value={localForm.duration || ''}
        onChange={(e) => setLocalForm({... localForm, duration: Number(e.target.value)})}
      />
      <TextField
        label="Calories Burned"
        type="number"
        fullWidth
        margin="dense"
        value={localForm.calories_burned || ''}
        onChange={(e) => setLocalForm({... localForm, calories_burned: Number(e.target.value)})}
      />
      <Box sx={{ display: 'flex', gap: '12px' }}>
        <TextField
          label="Sets"
          fullWidth
          margin="dense"
          type='number'
          value={localForm.exerciseSets || ''}
          onChange={(e) => setLocalForm({... localForm, exerciseSets: Number(e.target.value)})}
        />
        <TextField
          label="Reps"
          fullWidth
          margin="dense"
          type='number'
          value={localForm.exerciseReps || ''}
          onChange={(e) => setLocalForm({...localForm, exerciseReps: Number(e.target.value)})}
        />
        <TextField
          label="Weight"
          fullWidth
          margin="dense"
          type='number'
          value={localForm.exerciseWeight || ''}
          onChange={(e) => setLocalForm({... localForm, exerciseWeight: Number(e.target.value)})}
        />
      </Box>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleCancelDialog} color="secondary">
              Cancel
          </Button>
          <Button onClick={handleSaveEditExercise} color="primary" variant="contained">
              Save Changes
          </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditExerciseDialog;
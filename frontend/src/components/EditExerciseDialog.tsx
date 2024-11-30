import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField } from '@mui/material'
import { useState } from 'react'

type FormProps = {
  exerciseName: string;
  duration: number;
  calories_burned: number;
  exerciseSets: number;
  exerciseReps: number;
  exerciseWeight: number;
}

interface EditDialogProps {
  index: number;
  editDialogOpen: boolean;
  setEditDialogOpen: (newValue: boolean) => void;
  exerciseForm: FormProps;
  handleSaveEdit: (exerciseForm: FormProps[]) => any;
}

function EditExerciseDialog({ index, editDialogOpen, setEditDialogOpen, exerciseForm, handleSaveEdit  }: EditDialogProps) {

  const [localForm, setLocalForm] = useState(exerciseForm);

  //reset our form and close our dialog
  function handleCancelDialog () {
    setEditDialogOpen(false);
    setLocalForm({
      exerciseName: "",
      duration: 60,
      calories_burned: 0,
      exerciseSets: 0,
      exerciseReps: 0,
      exerciseWeight: 0,
    })
  }

  function handleSaveEditt () {
    

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
        value={exerciseForm.exerciseName}
        onChange={(e) => setLocalForm({... localForm, exerciseName: e.target.value})}
      />
      <TextField
        label="Time Spent (minutes)"
        type="number"
        fullWidth
        margin="dense"
        value={exerciseForm.duration}
        onChange={(e) => setLocalForm({... localForm, duration: Number(e.target.value)})}
      />
      <TextField
        label="Calories Burned"
        type="number"
        fullWidth
        margin="dense"
        value={exerciseForm.calories_burned}
        onChange={(e) => setLocalForm({... localForm, calories_burned: Number(e.target.value)})}
      />
      <Box sx={{ display: 'flex', gap: '12px' }}>
        <TextField
          label="Sets"
          fullWidth
          margin="dense"
          type='number'
          value={exerciseForm.exerciseSets}
          onChange={(e) => setLocalForm({... localForm, exerciseSets: Number(e.target.value)})}
        />
        <TextField
          label="Reps"
          fullWidth
          margin="dense"
          type='number'
          value={exerciseForm.exerciseReps}
          onChange={(e) => setLocalForm({... localForm, exerciseReps: Number(e.target.value)})}
        />
        <TextField
          label="Weight"
          fullWidth
          margin="dense"
          type='number'
          value={exerciseForm.exerciseWeight}
          onChange={(e) => setLocalForm({... localForm, exerciseWeight: Number(e.target.value)})}
        />
      </Box>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleCancelDialog} color="secondary">
              Cancel
          </Button>
          <Button onClick={() => handleSaveEditt()} color="primary" variant="contained">
              Save Changes
          </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditExerciseDialog;
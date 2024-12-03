import { Box, ListItem, TextField, Typography } from '@mui/material';
import React from 'react'

type ExerciseProps = {
  name: string;
  duration: number;
  calories_burned: number;
  sets: number;
  reps: number;
  weight: number;
}

interface DialogProps {
  key: number;
  exercise: ExerciseProps;
  setExercises: React.Dispatch<React.SetStateAction<ExerciseProps[]>>;
}

function ExerciseDialog({ key, exercise, setExercises }: DialogProps) {

  function updateExercises (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: keyof ExerciseProps) {
    // need to find the exercise with the given name
    setExercises((prevExercises: ExerciseProps[]) => 
      prevExercises.map((ex) => 
        ex.name === exercise.name
          ? {...ex, [type]: Number(e.target.value) }
          : ex  
      )  
    )
  }

  return (
    <ListItem
      key={key}
      sx={{ 
        backgroundColor: 'white', 
        border: 'solid 2px black', 
        borderRadius: '10px', 
        marginBottm: '10px', 
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginBottom: '10px',
        padding: '15px'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant='h5' color='black'>{exercise.name}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="Sets"
            margin='dense'
            type='number'
            value={exercise.sets || ''}
            onChange={(e) => updateExercises(e, 'sets')}
          />
          <TextField
            label="Reps"
            margin='dense'
            type='number'
            value={exercise.reps || ''}
            onChange={(e) => updateExercises(e, 'reps')}
          />
          <TextField
            label="Weight"
            margin='dense'
            type='number'
            value={exercise.weight || ''}
            onChange={(e) => updateExercises(e, 'weight')}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Calories Burned"
          margin='dense'
          type='number'
          value={exercise.calories_burned || ''}
          onChange={(e) => updateExercises(e, 'calories_burned')}
        />
        <TextField
          label="Duration"
          margin='dense'
          type='number'
          value={exercise.duration || ''}
          onChange={(e) => updateExercises(e, 'duration')}
        />
      </Box>
    </ListItem>
  )
}

export default ExerciseDialog
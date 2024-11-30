import { ListItem, ListItemText, Typography, Box, Button } from '@mui/material';
import React from 'react'

interface ExerciseContainerProp {
  key: number;
  name: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  calories: number | null;
  duration: number | null;
  toggleDialog: (bool: boolean) => void;
}

function ExerciseContainer({ key, name, sets, reps, weight, calories, duration, toggleDialog }: ExerciseContainerProp) {
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
        <Typography variant='h6' color='black'>{name}</Typography>
        <Typography color='gray'>Calories Burned: {calories}</Typography>
      </Box>
      <Box>
        <Typography color='black'>{sets} x {reps}, {weight} lbs</Typography>
        <Typography color='gray'>Duration: {duration} min</Typography>
      </Box>
      <Button variant='outlined' onClick={() => toggleDialog(true)}>Edit</Button>
      
    </ListItem>
  )
}

export default ExerciseContainer
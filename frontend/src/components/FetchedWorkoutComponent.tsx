import { ListItemText, Button, ListItemButton } from '@mui/material'
import React from 'react'

interface WorkoutComponentProps {
    key: number;
    selectedName: string;
    exerciseName: string;
    caloriesBurned: number;
    duration: number;
    handleClick: (name: string, burnedCalories: number, duration: number) => void;
}

function FetchedWorkoutComponent({ key, selectedName, exerciseName, caloriesBurned, duration, handleClick }: WorkoutComponentProps) {
  return (
    <ListItemButton 
      key={key} 
      sx={{ backgroundColor: 'white', border: 'solid 2px black', borderRadius: '10px', marginBottom: '10px' }}
      onClick={() => handleClick(exerciseName, caloriesBurned, duration)}  
      selected={exerciseName === selectedName}
    >
      <ListItemText 
        primary={exerciseName} 
        secondary={`Calories Burned: ${caloriesBurned}`} 
        primaryTypographyProps={{ style: { color: '#000000' } }} 
        secondaryTypographyProps={{ style: { color: '#A9A9A9' } }}
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
      />
    </ListItemButton>
  )
}

export default FetchedWorkoutComponent
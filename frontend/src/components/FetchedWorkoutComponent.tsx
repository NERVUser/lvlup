import { ListItem, ListItemText, Button } from '@mui/material'
import React from 'react'

interface WorkoutComponentProps {
    key: number
    exerciseName: string;
    caloriesBurned: number;
    isSelected: boolean;
}

function FetchedWorkoutComponent({ key, exerciseName, caloriesBurned, isSelected }: WorkoutComponentProps) {
  return (
    <ListItem key={key}>
      <ListItemText 
        primary={exerciseName} 
        secondary={`Calories Burned: ${caloriesBurned}`} 
        // primaryTypographyProps={{ style: { color: '#000000' } }} 
        // secondaryTypographyProps={{ style: { color: '#000000' } }} 
      />
      <Button>Add Exercise</Button>
    </ListItem>
  )
}

export default FetchedWorkoutComponent
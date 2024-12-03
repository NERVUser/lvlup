import { Box, ListItemButton, Typography } from '@mui/material';
import React, { useEffect } from 'react'

type ExerciseProp = {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
}

interface ReccomendedProp {
  key: number;
  selectedExercises: string[];
  setSelectedExercises: (name: string[]) => void;
  exercise: ExerciseProp;
}

function ReccomendedExercise({ key, selectedExercises, setSelectedExercises, exercise }: ReccomendedProp) {

  // handles selecting and deselecting an exercise
  function handleSelectingExercise () {

    let newSelections;

    // if we haven't selected it, add the exercise
    if(!selectedExercises.includes(exercise.name))
      newSelections = [...selectedExercises, exercise.name];
    else {
      newSelections = selectedExercises.filter(e => e !== exercise.name);
    }

    setSelectedExercises(newSelections)
  }

  return (
    <ListItemButton
      key={key}
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
      selected={selectedExercises.includes(exercise.name)}
      onClick={handleSelectingExercise}
    >
      <Typography variant='h5' color='black'>{exercise.name}</Typography>
      <Typography variant='h5' color='gray'>{exercise.difficulty}</Typography>
    </ListItemButton>
  )
}

export default ReccomendedExercise
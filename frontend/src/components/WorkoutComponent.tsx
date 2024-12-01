import { List, Dialog, DialogContent, ListItemButton, Typography, Box, ListItem } from '@mui/material'
import { useEffect, useState } from 'react'
import { useGetWorkoutExercises } from '../lib/supabase';

type ExerciseProp = {
  id: string;
  name: string;
  duration: number;
  calories_burned: number;
  sets: number;
  reps: number;
  weight: number;
}

type WorkoutProp = {
  id: string;
  created_at: string;
  name: string;
  user_id: string;
}

interface WorkoutInterface {
  key: number;
  workout: WorkoutProp
}

function WorkoutComponent({ key, workout }: WorkoutInterface) {

  const { data: workoutExercises } = useGetWorkoutExercises(workout.id);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <ListItemButton
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
        onClick={() => setDialogOpen(true)}
      >
        <Typography variant='h6' color='black'>{workout.name}</Typography>
      </ListItemButton>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent>
          <List>
            <Typography variant='h5' color='black'>Exercises</Typography>
            {workoutExercises?.map((exercise: ExerciseProp, index: number) => (
              <ListItem
              key={index}
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
                <Box sx={{marginRight: '20px' }}>
                  <Typography variant='h6' color='black'>{exercise.name}</Typography>
                  <Typography color='gray'>Calories Burned: {exercise.calories_burned}</Typography>
                </Box>
                <Box>
                  {exercise.sets && exercise.reps && exercise.weight && <Typography color='black'>
                    {exercise.sets} x {exercise.reps}, {exercise.weight} lbs
                  </Typography>}
                  <Typography color='gray'>Duration: {exercise.duration} min</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default WorkoutComponent
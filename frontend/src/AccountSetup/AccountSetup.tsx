import { Box, Button, TextField, Typography, Menu, MenuItem, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import './AccountSetup.css'
import React from 'react';
import { useUpdateUser } from '../lib/supabase';
import { useGlobalContext } from '../context/GlobalProvider';
import { useNavigate } from 'react-router-dom';

interface SetupFormProps {
  title: string;
  placeholder: string;
  value: string | number | null;
  type: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// used for our different forms
const SetupForm: React.FC<SetupFormProps> = ({title, placeholder, value, onChange, type }) => (
  <Box>
    <Typography variant='h6'>
      {title}
    </Typography>
    <TextField 
      type={type}
      value={value}
      onChange={onChange}
      margin='normal'
      className='setup-form'
      placeholder={placeholder}
      fullWidth
    />
  </Box>
)

function AccountSetup() {

  const [form, setForm] = useState({
    name: '',
    username: '',
    bio: '',
    age: 0,
    weight: 0,
    fitness_level: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useGlobalContext();
  const { mutate: updateUser } = useUpdateUser();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => setAnchorEl(null);
  const updateFitnessLevel = (new_level: number) => {
    setForm({...form, fitness_level: new_level});
    handleClose();
  };

  const hanldeUpdateUser = () => {
    setIsLoading(true);
    // only required fields here are age and weight
    if(!form.age || !form.weight)
      return alert("Please fill in weight and age first");

    try {
      // now update our user
      updateUser({
        id: user?.id,
        full_name: form.name,
        username: form.username,
        age: form.age,
        bio: form.bio,
        fitness_level: form.fitness_level,
        weight: form.weight
      }, {
        onError: () => {
          throw Error("Username already exists");
        }
      })

      navigate('/WorkoutJournal');
    } catch (error) {
      
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: 500 }}>
        <Box sx={{ marginBottom: 2 }}>
          <SetupForm
            title='What is your name?'
            value={form.name}
            placeholder='Enter name'
            onChange={(e) => setForm({...form, name: e.target.value})}
            type='text'
          />
          <SetupForm
            title='What username do you want?'
            value={form.username}
            placeholder='Enter username'
            onChange={(e) => setForm({...form, username: e.target.value})}
            type='text'
          />
          <SetupForm
            title='What is your age?'
            value={form.age}
            placeholder='Enter age'
            onChange={(e) => setForm({...form, age: parseInt(e.target.value)})}
            type='number'
          />
          <SetupForm
            title='What is your weight?'
            value={form.weight}
            placeholder='Enter weight'
            onChange={(e) => setForm({...form, weight: parseFloat(e.target.value)})}
            type='number'
          />
          <SetupForm
            title='Finally, tell use a little about yourself'
            value={form.bio}
            placeholder='Bio'
            onChange={(e) => setForm({...form, bio: e.target.value})}
            type='text'
          />
        </Box>
        <Box>
          <Typography variant='h6' sx={{ marginBottom: 2 }}>How often do you workout?</Typography>
          <Button
            sx={{ marginBottom: 2 }}
            id='basic-button'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            fullWidth
            variant='contained'
          >
            Select Fitness Level
          </Button>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby' : 'basic-button'
            }}
          >
            <MenuItem onClick={() => updateFitnessLevel(0)}>Never</MenuItem>
            <MenuItem onClick={() => updateFitnessLevel(1)}>Rarely (1-2 times per month)</MenuItem>
            <MenuItem onClick={() => updateFitnessLevel(3)}>Occasionally (1-2 times per week)</MenuItem>
            <MenuItem onClick={() => updateFitnessLevel(4)}>Regularly (3-4 times per week)</MenuItem>
            <MenuItem onClick={() => updateFitnessLevel(6)}>Frequently (5-6 times per week)</MenuItem>
            <MenuItem onClick={() => updateFitnessLevel(7)}>Daily (7 days a week)</MenuItem>
            <MenuItem onClick={() => updateFitnessLevel(9)}>Multiple Times a Day</MenuItem>
          </Menu>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={hanldeUpdateUser}
            >
              Save and Continue
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default AccountSetup
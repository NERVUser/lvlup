import { Box, Button, TextField, Typography, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import './AccountSetup.css'
import React from 'react';

interface SetupFormProps {
  title: string;
  placeholder: string;
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// used for our different forms
const SetupForm: React.FC<SetupFormProps> = ({title, placeholder, value, onChange }) => (
  <Box>
    <Typography variant='h6'>
      {title}
    </Typography>
    <TextField 
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
    age: 0,
    weight: 0,
    fitness_level: 0
  })

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => setAnchorEl(null);
  const updateFitnessLevel = (new_level: number) => {
    setForm({...form, fitness_level: new_level});
    handleClose();
  }

  useEffect(() => {
    console.log("New update", form.fitness_level)
  }, [form]);

  return (
    <Box sx={{ width: 500 }}>
      <Box sx={{ marginBottom: 2 }}>
        <SetupForm
          title='What is your name?'
          value={form.name}
          placeholder='Enter name'
          onChange={(e) => setForm({...form, name: e.target.value})}
        />
        <SetupForm
          title='What username do you want?'
          value={form.username}
          placeholder='Enter username'
          onChange={(e) => setForm({...form, username: e.target.value})}
        />
        <SetupForm
          title='What is your age?'
          value={form.age}
          placeholder='Enter age'
          onChange={(e) => setForm({...form, age: parseInt(e.target.value)})}
        />
        <SetupForm
          title='What is your weight?'
          value={form.weight}
          placeholder='Enter weight'
          onChange={(e) => setForm({...form, weight: parseFloat(e.target.value)})}
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
      <Button
        variant='contained'
        fullWidth
      >
        Save and Continue
      </Button>
    </Box>
  )
}

export default AccountSetup
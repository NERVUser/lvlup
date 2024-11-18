import React, { useState } from 'react';
import './Signup.css';
import { TextField, Button, Typography, Box } from '@mui/material';
import { createUser } from '../lib/supabase'

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const resetFields = () => {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }

    const handleSignup = async () => {
        // Logic for signup action can be implemented here

        // check to make sure we filled in all fields
        if(!email || !password || !confirmPassword)
          return window.alert('Error, Please fill in all fields');

        //make sure our passwords match
        if(password !== confirmPassword)
          return window.alert('Error, Passwords do not match');

        try {
          const result = await createUser(email, password);
          if(result){
            // set our user and set is logged in to true
            resetFields();
          }
        } catch (error) {
          console.log(error);
        }
    };

    return (
      <Box className="signup-container">
        <Typography variant="h4" className="logo-text">LVL UP</Typography>
        <Box className="signup-form">
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
          />
          <Button
            color='primary'
            variant='contained'
            fullWidth
            onClick={handleSignup}
            className="signup-button"
          >
            Create Account
          </Button>
          <div
            className='login-container'
          >
            <p>or</p>
            <Button
              variant='text'
              color='primary'
              fullWidth
            >
              Login
            </Button>
          </div>
        </Box>
      </Box>
    );
}

export default Signup;
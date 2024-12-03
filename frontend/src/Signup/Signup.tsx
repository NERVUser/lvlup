import React, { useState } from 'react';
import './Signup.css';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { createUser } from '../lib/supabase'
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalProvider';
import logo from '../image_assets/main_logo.png'

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser, setIsLoggedIn } = useGlobalContext();

    const handleSignup = async () => {
        // Logic for signup action can be implemented here

        // check to make sure we filled in all fields
        if(!email || !password || !confirmPassword)
          return window.alert('Error, Please fill in all fields');

        //make sure our passwords match
        if(password !== confirmPassword)
          return window.alert('Error, Passwords do not match');

        setIsLoading(true);

        try {
          const result = await createUser(email, password);
          if(result){
            // set our user and set is logged in to true
            setUser(result);
            setIsLoggedIn(true);
            navigate('/AccountSetup');
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
    };

    return (
      <Box className="signup-container">
        <img src={ logo } alt="" id="logo" style={{marginBottom: '15px'}}/>
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button
                color='primary'
                variant='contained'
                fullWidth
                onClick={handleSignup}
                className="signup-button"
              >
                Create Account
              </Button>
            )}
          </Box>
        </Box>
        <div
            className='login-container'
          >
            <p>Aleady Have an Account?</p>
            <Button
              variant='text'
              color='primary'
              className='login-button'
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
      </Box>
    );
}

export default Signup;
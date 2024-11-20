import React, { useState } from 'react';
import './Login.css';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib/supabase';
import { useGlobalContext } from '../context/GlobalProvider';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const handleLogin = async () => {
    if(!email || !password)
      return alert("Error, please fill in all fields");

    setIsLoading(true);

      try {
        const data = await signIn(email, password);

        if(data){
          // do all this stuff
          setUser(data);
          setIsLoggedIn(true);
          navigate('/WorkoutJournal')
        }
      } catch (error: any) {
        alert(error.message);
      } finally {
        setIsLoading(false);
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
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              className="signup-button"
            >
              Log In
            </Button>
          )}
        </Box>
        <div className='noAccount-container'>
          <p>Don't have an account?</p>
          <Button
            variant='text'
            color='primary'
            className='signup-button'
            onClick={() => navigate('/Signup')}
          >
            Signup
          </Button>
        </div>
      </Box>
    </Box>
  );
}

export default Login;
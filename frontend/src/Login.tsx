import React, { useState } from 'react';
import './Signup.css';
import { TextField, Button, Typography, Box } from '@mui/material';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Logic for login action can be implemented here
        console.log("Log in with:", { email, password });
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
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                    className="signup-button"
                >
                    Log In
                </Button>
            </Box>
        </Box>
    );
}

export default Login;

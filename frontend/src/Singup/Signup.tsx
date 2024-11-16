import React, { useState } from 'react';
import './Signup.css';
import { TextField, Button, Typography, Box } from '@mui/material';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = () => {
        // Logic for signup action can be implemented here
        console.log("Sign up with:", { email, password, confirmPassword });
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
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSignup}
                    className="signup-button"
                >
                    Create Account
                </Button>
            </Box>
        </Box>
    );
}

export default Signup;
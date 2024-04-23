// Login.js
import React from 'react';
import { Button, Typography, Box, Paper, Container } from '@mui/material';

const Login = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#87CEEB',
                backgroundSize: 'cover', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'rgb(255, 255, 255, 0.8)',
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
                        Welcome to Expense Manager
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
                        Streamline Your Spending: Effortlessly Organize and Monitor Your Finances.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => window.location.href = "/auth/login"}
                    >
                        Login
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
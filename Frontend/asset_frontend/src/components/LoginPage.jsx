import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import Sidenav from '../components/Sidenav';
import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import axios from 'axios';

// Email and Password Regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function LoginPage({ auth, setAuth }) {
  const [open, setOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email and password
    if (!emailRegex.test(email)) {
      alert('Invalid email format');
      return;
    }
    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character');
      return;
    }

    if (!password || !email) {
      alert('Please fill out the form completely');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/employee/admin');
      const check = response.data.result.filter((item) => item && item.Email === email && item.Password === password);
      console.log(check);
      if (check.length > 0) {
       
        setAuth(true);
        localStorage.setItem('authToken', JSON.stringify(check[0])); // Storing user data, not just token
        navigate('/');
      } else {
        setAuth(false);
        alert('Invalid email or password');
      }
      handleClose();
    } catch (err) {
      console.log('Error in fetching/authenticating admin', err);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div>
      <Navbar auth={auth} />
      <Box height={80} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 3, p: 3 }}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Login
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleLogin} color="primary">
                Login
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </div>
  );
}

export default LoginPage;

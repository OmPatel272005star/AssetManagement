import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, IconButton, Select, InputLabel, FormControl, FormHelperText } from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import '../AddCategory.css';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function AddEmployee({ onAddEmployee }) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let valid = true;

    if (!firstName || !lastName || !email || !phoneNo) {
      alert('Please fill the form correctly');
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      valid = false;
    } else {
      setEmailError('');
    }

    if (phoneNo.length !== 10) {
      setPhoneError('Please fill a valid phone number');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (!valid) {
      return;
    }

    const newEmployee = {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PhoneNo: phoneNo
    };

    try {
      const response = await axios.post('http://localhost:3000/employee/add', newEmployee);
      onAddEmployee(newEmployee);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" style={{ float: 'right', marginRight: '-1000px' }} startIcon={<AddIcon />} onClick={handleOpen}>
        Add Employee
      </Button>
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Employee
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <form className="form" onSubmit={handleSubmit}>
            <div className="box">
              <TextField
                fullWidth
                label="First Name"
                placeholder="Type Employee's First Name"
                name="FirstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                margin="normal"
              />
            </div>
            <div className="box">
              <TextField
                fullWidth
                label="Last Name"
                placeholder="Type Employee's Last Name"
                name="LastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                margin="normal"
              />
            </div>
            <div className="box">
              <FormControl fullWidth margin="normal" error={!!emailError}>
                <TextField
                  label="Email"
                  placeholder="Type Employee's Email"
                  name="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                />
                {emailError && <FormHelperText>{emailError}</FormHelperText>}
              </FormControl>
            </div>
            <div className="box">
              <FormControl fullWidth margin="normal" error={!!phoneError}>
                <TextField
                  label="Phone Number"
                  placeholder="Type Employee's Phone Number"
                  name="PhoneNo"
                  value={phoneNo}
                  type="number"
                  onChange={(e) => setPhoneNo(e.target.value)}
                  margin="normal"
                />
                {phoneError && <FormHelperText>{phoneError}</FormHelperText>}
              </FormControl>
            </div>
            <DialogActions>
              <Button variant="contained" color="primary" type="submit" className="submit">
                Add
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddEmployee;

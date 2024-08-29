import React, { useState, useEffect } from 'react';
import { Button, TextField, FormControl, FormHelperText } from '@mui/material';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\d{10}$/;

function UpdateEmployee({ employee, onUpdate }) {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (employee) {
      setFirstName(employee.FirstName);
      setLastName(employee.LastName);
      setEmail(employee.Email);
      setPhoneNo(employee.PhoneNo);
    }
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

    if (!phoneRegex.test(phoneNo)) {
      setPhoneError('Please fill a valid phone number');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (!valid) {
      return;
    }

    const updatedEmployee = {
      EmployeeId: employee.EmployeeId,
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PhoneNo: phoneNo,
    };

    try {
      await axios.put(`http://localhost:3000/employee/update/${employee.EmployeeId}`, updatedEmployee);
      onUpdate(updatedEmployee);
      handleClose();
    } catch (err) {
      console.error("There was an error updating the employee", err);
    }
  };

  return (
    <>
      <Button className="update" onClick={handleShow}>
        Update
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form" onSubmit={handleSubmit}>
            <div className="box">
              <TextField
                fullWidth
                label="First Name"
                placeholder="Type Employee's First Name"
                name="firstName"
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
                name="lastName"
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
                  name="email"
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
                  label="Phone No"
                  placeholder="Type Employee's Phone No"
                  name="phoneNo"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  margin="normal"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
                {phoneError && <FormHelperText>{phoneError}</FormHelperText>}
              </FormControl>
            </div>
            <div className="box">
              <Button variant="contained" color="primary" type="submit" className="submit">
                Update
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UpdateEmployee;

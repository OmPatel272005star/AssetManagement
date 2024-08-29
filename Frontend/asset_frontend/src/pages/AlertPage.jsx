import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

function AlertPage() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate('/login');
  };

  const alertStyle = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '20px',
    border: '2px solid #f5c6cb',
    borderRadius: '10px',
    fontWeight: 'bold',
    marginBottom: '30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const contentStyle = {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.5',
  };

  const dialogTitleStyle = {
    fontFamily: 'Georgia, serif',
    fontSize: '2rem',
    color: '#333',
  };

  const dialogActionsStyle = {
    justifyContent: 'center',
    marginTop: '30px',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={dialogTitleStyle}>Authentication Required</DialogTitle>
        <DialogContent dividers>
          <div style={alertStyle}>Please login to access this page.</div>
          <div style={contentStyle}>
            {/* Your other content here */}
            <p>This is your AlertPage content.</p>
          </div>
        </DialogContent>
        <DialogActions style={dialogActionsStyle}>
          <Button onClick={handleClose} color="primary" variant="contained" style={buttonStyle}>
            Close
          </Button>
          {/* You can add additional buttons for login or other actions */}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertPage;
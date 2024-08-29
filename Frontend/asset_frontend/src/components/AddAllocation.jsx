import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddAllocation.css';

function AddAllocation({ onAddAllocation }) {
  const [show, setShow] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [assetId, setAssetId] = useState('');
  const [assignDate, setAssignDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const validation = () => {
    if ( (returnDate && assignDate && returnDate < assignDate) ) {
      const alertDiv = document.createElement('div');
    alertDiv.textContent = 'Return date should not be before the assign date';
    alertDiv.style.color = 'red';
    alertDiv.style.padding = '10px';
    alertDiv.style.border = '1px solid red';
    alertDiv.style.borderRadius = '5px';
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translateX(-50%)';
    alertDiv.style.background = 'rgba(255, 0, 0, 0.1)';
    alertDiv.style.zIndex = '9999';
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.remove();
    }, 2000);
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/employee/getAll');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/asset/getallasset');
        setAssets(response.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchEmployees();
    fetchAssets();
  }, []);

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    
    // Validate before submitting
    if (!validation()) {
      return; // Exit early if validation fails
    }

    const newAllocation = {
      EmployeeId: employeeId,
      AssetId: assetId,
      AssignDate: assignDate,
      ReturnDate: returnDate || null,
    };

    try {
      const response = await axios.post('http://localhost:3000/allocate/addallocation', newAllocation);
      console.log(response.data);
      onAddAllocation(newAllocation); // Update the parent component with the new allocation
      handleClose();
    } catch (error) {
      console.error('Error adding allocation:', error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} style={{ float: 'right' }}>
        Allocate Asset
      </Button>

      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Allocate Asset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="employeeId">Employee</label>
              <input
                type="text"
                id="employeeId"
                className="form-control"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter Employee ID"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="assetId">Asset</label>
              <input
                type="text"
                id="assetId"
                className="form-control"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="Enter Asset ID"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="assignDate">Assign Date</label>
              <input
                type="date"
                id="assignDate"
                className="form-control"
                value={assignDate}
                onChange={(e) => setAssignDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="returnDate">Return Date</label>
              <input
                type="date"
                id="returnDate"
                className="form-control"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <Button variant="primary" type="submit">
                Allocate
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddAllocation;

import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import '../AddCategory.css';

function UpdateAllocation({ allocation, handleUpdateAllocation }) {
  const [show, setShow] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [employeeId, setEmployeeId] = useState(allocation.EmployeeId);
  const [assetId, setAssetId] = useState(allocation.AssetId);
  const [assignDate, setAssignDate] = useState(allocation.AssignDate);
  const [returnDate, setReturnDate] = useState(allocation.ReturnDate);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // Set the initial values when the modal opens
    setEmployeeId(allocation.EmployeeId);
    setAssetId(allocation.AssetId);
    setAssignDate(allocation.AssignDate);
    setReturnDate(allocation.ReturnDate);
    setShow(true);
  };

  useEffect(() => {
    console.log(assignDate);
    console.log(employeeId);
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
    const updatedAllocation = {
      EmployeeId: employeeId,
      AssetId: assetId,
      AssignDate: assignDate,
      ReturnDate: returnDate || null,
    };
    try {
      const response = await axios.put(`http://localhost:3000/allocate/updateallocation/${allocation.AllocationId}`, updatedAllocation);
      console.log(response.data);
      handleUpdateAllocation(response.data); // Update the parent component with the new allocation
      handleClose();
    } catch (error) {
      console.error('Error updating allocation:', error);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>Update</Button>
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Allocation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
              <label>Employee</label>
              <input className="form-control" type='text' value={employeeId} placeholder='enter employeeid' onChange={(e)=>setEmployeeId(e.target.value)}/>
            </div> 
            <div className="form-group">
              <label>Asset</label>
              <input
                className="form-control"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                required
              />
              </div>  
            <div className="form-group">
              <label>Assign Date</label>
              <input type="date" className="form-control" value={assignDate} onChange={(e) => setAssignDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Return Date</label>
              <input type="date" className="form-control" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
            </div>
            <Button variant="primary" type="submit">Save changes</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UpdateAllocation;

import React, { useState, useEffect } from 'react';
import Sidenav from '../components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Typography from '@mui/material/Typography';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { styled } from '@mui/material/styles';
import AddEmployee from '../components/AddEmployee';
import UpdateEmployee from './UpdateEmployee';

const StyledTable = styled(Table)`
  border-collapse: collapse;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  margin: 1rem 0;

  thead tr {
    background-color: #f8f9fa;
    color: #333;
    font-weight: bold;
  }

  tbody tr:nth-of-type(even) {
    background-color: #f8f9fa;
  }

  th,
  td {
    padding: 0.75rem;
    border: 1px solid #dee2e6;
  }
`;

const PageTitle = styled(Typography)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
`;

function Employee() {
  const [arr, setArr] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const getAllEmployee = async () => {
      let response;
      try {
        response = await axios.get('http://localhost:3000/employee/getAll');
      } catch (err) {
        console.log(err);
        return; // exit the function if there's an error
      }
      if (response) {
        setArr(response.data); // no need to use await here
      }
    };
    getAllEmployee();
  }, [arr]);

  const deleteEmployee = async (EmployeeId) => {
    try {
      await axios.delete(`http://localhost:3000/employee/delete/${EmployeeId}`);
    } catch (err) {
      console.log(`There is an error in deleting employee ${err}`);
    }
  };

  const handleAddEmployee = (newEmployee) => {
    setArr([...arr, newEmployee]);
  };

  return (
    <>
      <Navbar />
      <Box height={50} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#F1F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: '4px' }}>
            <PageTitle>Employee List</PageTitle>
            <AddEmployee onAddEmployee={handleAddEmployee} />
            <Box height={30} />
          </div>

          <StyledTable striped hover size="sm">
            <thead>
              <tr>
                <th>EmployeeId</th>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Email</th>
                <th>PhoneNo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {arr.map((item) => (
                <tr key={item.EmployeeId}>
                  <td>{item.EmployeeId}</td>
                  <td>{item.FirstName}</td>
                  <td>{item.LastName}</td>
                  <td>{item.Email}</td>
                  <td>{item.PhoneNo}</td>
                  <td>
                    <UpdateEmployee 
                      employee={item} 
                      onUpdate={(updatedEmployee) => {
                        const updatedArr = arr.map(emp => emp.EmployeeId === updatedEmployee.EmployeeId ? updatedEmployee : emp);
                        setArr(updatedArr);
                      }}
                    />
                    <Button onClick={() => deleteEmployee(item.EmployeeId)} color="error" variant="contained" size="sm">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </Box>
      </Box>
    </>
  );
}

export default Employee;

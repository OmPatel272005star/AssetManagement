import React, { useState, useEffect } from 'react';
import Sidenav from '../components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Typography from '@mui/material/Typography';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import AddAllocation from '../components/AddAllocation';
import UpdateAllocation from './UpdateAllocation';

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

function Allocation(z) {
  const [allocations, setAllocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/allocate/getallocation');
        setAllocations(response.data);
      } catch (error) {
        console.error('Error fetching allocations:', error);
      }
    };

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

    fetchAllocations();
    fetchEmployees();
    fetchAssets();
  }, []);

  const getAssetCode = (assetId) => {
    const assetItem = assets.find((item) => item.AssetId === assetId);
    return assetItem ? { code: assetItem.Code, name: assetItem.AssetName } : { code: '', name: '' };
  };

  const getEmployeeName = (employeeId) => {
    const employeeItem = employees.find((item) => item.EmployeeId === employeeId);
    return employeeItem ? `${employeeItem.FirstName} ${employeeItem.LastName || ''}` : '';
  };

  const handleAddAllocation = (newAllocation) => {
    setAllocations([...allocations, newAllocation]);
  };

  const handleUpdateAllocation = (updatedAllocation) => {
    setAllocations(allocations.map(allocation =>
      allocation.AllocationId === updatedAllocation.AllocationId ? updatedAllocation : allocation
    ));
  };

  // Function to format date to yyyy-mm-dd
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // returns yyyy-mm-dd
  };

  return (
    <>
      <Navbar />
      <Box height={50} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#F1F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: '4px' }}>
            <PageTitle>Allocation List</PageTitle>
            <Box height={30} />
            <AddAllocation onAddAllocation={handleAddAllocation} />
          </div>
          <StyledTable striped hover size="sm">
            <thead>
              <tr>
                <th>Asset Code</th>
                <th>Asset Name</th>
                <th>Employee Name</th>
                <th>Allocation Date</th>
                <th>Return Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((alloc) => {
                const { code, name } = getAssetCode(alloc.AssetId);
                const employeeName = getEmployeeName(alloc.EmployeeId);
                return (
                  <tr key={alloc.AllocationId}>
                    <td>{code}</td>
                    <td>{name}</td>
                    <td>{employeeName}</td>
                    <td>{formatDate(alloc.AssignDate)}</td>
                    <td>{alloc.ReturnDate ? formatDate(alloc.ReturnDate) : 'N/A'}</td>
                    <td>
                      <UpdateAllocation allocation={alloc} handleUpdateAllocation={handleUpdateAllocation} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </StyledTable>
        </Box>
      </Box>
    </>
  );
}

export default Allocation;

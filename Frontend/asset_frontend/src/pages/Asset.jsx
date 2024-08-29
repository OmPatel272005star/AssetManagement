import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidenav from '../components/Sidenav';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddCategoryModal from '../components/AddCategoryModal';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import AddAssetModal from '../components/AddAssetModal';
import { styled } from '@mui/material/styles';

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

function Asset() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/asset/getallasset');
        setAssets(response.data);
      } catch (err) {
        console.error('Error fetching assets:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/category/getcategories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchAssets();
    fetchCategories();
  }, []);

  // Function to format date to yyyy-mm-dd
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return `${year}-${month}-${day}`;
  };

  const getParentCategoryName = (ParentCategoryId) => {
    const parentCategory = categories.find((cat) => cat.CategoryId === ParentCategoryId);
    return parentCategory ? parentCategory.Name : 'None';
  };

  const handleAddAsset = (newAsset) => {
    setAssets([...assets, newAsset]);
  };

  return (
    <>
      <Navbar />
      <Box height={50} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#F1F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: '4px' }}>
            <PageTitle>Asset List</PageTitle>
            <Box height={30} />
            <AddAssetModal onAddAsset={handleAddAsset} />
          </div>
          <StyledTable>
            <thead>
              <tr>
                <th>Category</th>
            
                <th>Name</th>
                <th>Code</th>
                <th>Purchase Date</th>
                <th>Status</th>
                <th>Reason for Dead</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => {
                const category = categories.find((cat) => cat.CategoryId === asset.CategoryId);
                const categoryName = category ? category.Name : 'Unknown';
                const parentCategoryName = category && category.ParentCategoryId ? getParentCategoryName(category.ParentCategoryId) : 'None';
                return (
                  <tr key={asset.AssetId}>
                    <td>{categoryName}</td>
                    <td>{asset.AssetName}</td>
                    <td>{asset.Code}</td>
                    <td>{formatDate(asset.PurchaseDate)}</td>
                    <td>{asset.isDead ? 'Dead' : 'Active'}</td>
                    <td>{asset.ReasonForDead || 'N/A'}</td>
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

export default Asset;

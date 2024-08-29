import React, { useState, useEffect } from 'react';
import Sidenav from '../components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar';
import Typography from '@mui/material/Typography';
import AddCategoryModal from '../components/AddCategoryModal';
import UpdateCategoryModal from './updateCategoryModal';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
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

function Category() {
  const [categories, setCategories] = useState([]);
  const [parentCategoryNames, setParentCategoryNames] = useState({});

  // Fetch initial data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/category/getcategories');
        setCategories(response.data);

        const parentCategoryPromises = response.data
          .filter(category => category.ParentCategoryId !== null)
          .map(async category => {
            const parentCategory = await getParentCategory(category.ParentCategoryId);
            return { categoryId: category.CategoryId, parentCategoryName: parentCategory[0]?.Name || '' };
          });

        const parentCategoryData = await Promise.all(parentCategoryPromises);
        const parentCategoryNamesObj = Object.fromEntries(parentCategoryData.map(({ categoryId, parentCategoryName }) => [categoryId, parentCategoryName]));
        setParentCategoryNames(parentCategoryNamesObj);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const getParentCategory = async (parentCategoryId) => {
    try {
      const response = await axios.get('http://localhost:3000/category/getcategories');
      const parentCategory = response.data.filter(item => item && item.CategoryId === parentCategoryId && item.ParentCategoryId === null);
      return parentCategory;
    } catch (error) {
      console.error('Error fetching parent category:', error);
      return [];
    }
  };

  // Function to delete a category
  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:3000/category/deletecategory/${categoryId}`);
      // Filter out the deleted category from the state
      setCategories(categories.filter(category => category.CategoryId !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Function to update a category in state
  const updateCategoryInState = (updatedCategory) => {
    setCategories(categories.map(category =>
      category.CategoryId === updatedCategory.CategoryId ? updatedCategory : category
    ));
  };

  const handleAddCategory = (newCategory) => {
    console.log("category");
    setCategories([...categories, newCategory]); // Add new category to state
  };

  return (
    <>
      <Navbar />
      <Box height={50} />
      <Box sx={{ display: 'flex' }}>
        <Sidenav/>
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#F1F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: '4px' }}>
            <PageTitle>Category List</PageTitle>
            <Box height={30} />
            <AddCategoryModal onAddCategory={handleAddCategory} />
          </div>

          {categories.length > 0 && (
            <StyledTable striped hover size="sm">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Parent Category</th>
                  <th>Prefix</th>
                  <th>IsActive</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.CategoryId}>
                    <td>{category.Name}</td>
                    <td>{parentCategoryNames[category.CategoryId] || ''}</td>
                    <td>{category.Prefix}</td>
                    <td>{category.IsActive ? 'Yes' : 'No'}</td>
                    
                    <td>
                      <UpdateCategoryModal
                        category={category}
                        onUpdateCategory={(updatedCategory) => {
                          updateCategoryInState({ ...updatedCategory, CategoryId: category.CategoryId });
                        }}
                      />
                      <Button onClick={() => deleteCategory(category.CategoryId)} color="error" variant="contained" size="sm">
                        <Typography variant="contained" color="error">
                          Delete
                        </Typography>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          )}
        </Box>
      </Box>
    </>
  );
}

export default Category;
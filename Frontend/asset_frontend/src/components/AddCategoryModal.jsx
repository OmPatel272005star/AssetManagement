import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button,Dialog,DialogActions,DialogContent,DialogTitle,TextField,MenuItem,IconButton,Select,InputLabel,FormControl} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import '../AddCategory.css';

function AddCategoryModal({ onAddCategory }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [prefix, setPrefix] = useState('');
  const [isActive, setIsActive] = useState('0');
  const [isDeleted, setIsDeleted] = useState('0');
  const [array, setArray] = useState([]);
  const [parentCategoryId, setParentCategoryId] = useState(null);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
   
  
  const getTable = async () => {
    try {
      const response = await axios.get('http://localhost:3000/category/getcategories');
      const categories = response.data
        .filter(item => item && item.Name && item.ParentCategoryId == null)
        .map(item => item.Name);
      setArray(categories);
    } catch (err) {
      console.log(`Error in fetching table from frontend: ${err}`);
    }
  };

  useEffect(() => {
    getTable();
  }, []);

  useEffect(() => {
    if (parentCategory) {
      const fetchParentCategoryId = async () => {
        try {
          const response = await axios.get('http://localhost:3000/category/getcategories');
          const parentCategoryItem = response.data.find(item => item.Name == parentCategory && item.parentCategoryId == null);
          if (parentCategoryItem) {
            setParentCategoryId(parentCategoryItem.CategoryId);
          }
        } catch (err) {
          console.log(`Error in fetching parent category ID: ${err}`);
        }
      };
      fetchParentCategoryId();
    }
  }, [parentCategory]);

  const handleSubmit = async (e) => {
    if(!category  || !prefix || !isActive ||!isDeleted){
      alert('Please fill out the form commpletely');
      return;
    }
    e.preventDefault();
    console.log("addcategorymodal");
    const newCategory = {
      name: category,
      parentCategoryId: parentCategoryId || null,
      prefix,
      isActive: parseInt(isActive, 10), // Convert to integer
      isDeleted: parseInt(isDeleted, 10), // Convert to integer
    };
    try {
      const response = await axios.post('http://localhost:3000/category/addcategory', newCategory);
      onAddCategory(newCategory);
      handleClose();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen} style={{ float: 'right' }} startIcon={<AddIcon />}>
        Add Category
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Category
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
                label="Category"
                placeholder="Type Category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                margin="normal"
              />
            </div>

            <div className="box">
              <FormControl fullWidth margin="normal">
                <InputLabel>Parent Category</InputLabel>
                <Select
                  name="parentCategory"
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  label="Parent Category"
                >
                  <MenuItem value="" disabled>
                    Select Parentcategory if applicable
                  </MenuItem>
                  {array.map((cat, idx) => (
                    <MenuItem key={idx} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="box">
              <TextField
                fullWidth
                label="Prefix"
                type="text"
                placeholder="Type Prefix"
                name="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                margin="normal"
              />
            </div>

            <div className="box">
              <FormControl fullWidth margin="normal">
                <InputLabel>IsActive</InputLabel>
                <Select
                  name="isActive"
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value)}
                  label="IsActive"
                >
                  <MenuItem value="" disabled>
                    Select option
                  </MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="0">0</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="box">
              <FormControl fullWidth margin="normal">
                <InputLabel>IsDeleted</InputLabel>
                <Select
                  name="isDeleted"
                  value={isDeleted}
                  onChange={(e) => setIsDeleted(e.target.value)}
                  label="IsDeleted"
                >
                  <MenuItem value="" disabled>
                    Select option
                  </MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="0">0</MenuItem>
                </Select>
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

export default AddCategoryModal
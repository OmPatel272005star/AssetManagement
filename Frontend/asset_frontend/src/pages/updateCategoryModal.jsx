import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, IconButton, Select, InputLabel, FormControl } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import '../AddCategory.css'; // Ensure this file contains necessary styles

function UpdateCategoryModal({ category, onUpdateCategory }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category.Name);
  const [parentCategory, setParentCategory] = useState(category.ParentCategoryId || '');
  const [prefix, setPrefix] = useState(category.Prefix);
  const [isActive, setIsActive] = useState(category.IsActive ? '1' : '0');
  const [isDeleted, setIsDeleted] = useState(category.IsDeleted ? '1' : '0');
  const [array, setArray] = useState([]);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const getTable = async () => {
    try {
      const response = await axios.get('http://localhost:3000/category/getcategories');
      const categories = response.data
        .filter(item => item && item.Name && item.parentCategoryId == null)
        .map(item => item.Name);
      setArray(categories);
    } catch (err) {
      console.log(`Error in fetching table from frontend: ${err}`);
    }
  };

  useEffect(() => {
    getTable();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedCategory = {
      Name: name,
      ParentCategoryId: parentCategory || null,
      Prefix: prefix,
      IsActive: parseInt(isActive, 10), // Convert to integer
      IsDeleted: parseInt(isDeleted, 10), // Convert to integer
    };

    try {
      // Make PUT request to update category
      const response = await axios.put(`http://localhost:3000/category/updatecategory/${category.CategoryId}`, updatedCategory);

      // Update state with the updated category
      const updatedArray = array.map(item => {
        if (item.name === updatedCategory.Name) {
          return { ...item, prefix: updatedCategory.Prefix };
        }
        return item;
      });
      setArray(updatedArray);

      // Trigger any callback to update parent component or close modal
      onUpdateCategory(updatedCategory);
      handleClose();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <>
      <Button color="warning" onClick={handleOpen}>
        Update
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Category
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                    Select category if applicable
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
              <Button type="submit" className="submit" color="warning">
                Update
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UpdateCategoryModal;

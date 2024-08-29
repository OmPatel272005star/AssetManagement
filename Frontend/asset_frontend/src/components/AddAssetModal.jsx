import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import '../AddCategory.css';

function AddAssetModal({ onAddAsset }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [code, setCode] = useState('');
  const [assetName, setAssetName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [isDead, setIsDead] = useState('0');
  const [reasonForDead, setReasonForDead] = useState('');
  const [categories, setCategories] = useState([]);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/category/getcategories');
        const items = response.data.filter((item) => item && item.ParentCategoryId !== null);
        setCategories(items);
      } catch (err) {
        console.log(`error in fetching categories ${err}`);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !code || !assetName || !purchaseDate || !isDead) {
      alert('Please fill this form correctly');
      return;
    }

    const selectedCategory = categories.find(cat => cat.Name === category);
    const categoryId = selectedCategory ? selectedCategory.CategoryId : null;

    if (!categoryId) {
      console.error('Invalid category selected');
      return;
    }

    const newAsset = {
      Code: code,
      CategoryId: categoryId,
      PurchaseDate: purchaseDate,
      AssetName: assetName,
      isDead: isDead,
      ReasonForDead: reasonForDead,
    };

    try {
      const response = await axios.post('http://localhost:3000/asset/addasset', newAsset);
      onAddAsset(newAsset);
      handleClose();
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen} style={{ float: 'right' }} startIcon={<AddIcon />}>
        Add Asset
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Asset
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
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="" disabled>
                    Select category if applicable
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.CategoryId} value={cat.Name}>{cat.Name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="box">
              <TextField
                fullWidth
                label="Code"
                type="text"
                placeholder="Type Code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                margin="normal"
              />
            </div>

            <div className="box">
              <TextField
                fullWidth
                label="Asset Name"
                type="text"
                placeholder="Type Asset Name"
                name="assetName"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                margin="normal"
              />
            </div>

            <div className="box">
              <TextField
                fullWidth
                label="Purchase Date"
                type="date"
                placeholder="Type Purchase Date"
                name="purchaseDate"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </div>

            <div className="box">
              <FormControl fullWidth margin="normal">
                <InputLabel>Is Dead</InputLabel>
                <Select
                  name="isDead"
                  value={isDead}
                  onChange={(e) => setIsDead(e.target.value)}
                  label="Is Dead"
                >
                  <MenuItem value="" disabled>
                    Select option
                  </MenuItem>
                  <MenuItem value="1">Yes</MenuItem>
                  <MenuItem value="0">No</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="box">
              <TextField
                fullWidth
                label="Reason For Dead"
                type="text"
                placeholder="Write if applicable"
                name="reasonForDead"
                value={reasonForDead}
                onChange={(e) => setReasonForDead(e.target.value)}
                margin="normal"
              />
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

export default AddAssetModal;

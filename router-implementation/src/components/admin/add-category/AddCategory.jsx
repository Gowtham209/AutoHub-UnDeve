import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Tile from '../../test-tile/Tile';
import axios from '../../utility/axios';
import authorize from '../../utility/Authorizer';
import userIdExtract from '../../utility/userIdExtractor';
import roleExtract from '../../utility/roleExtractor'
import  { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './AddCategory.css'

function AddCategory() {
  const [categoryList, setCategoryList] = useState([]);
  const [carType, setCarType] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewMode, setViewMode] = useState('current'); // 'current' or 'discontinued'

  const categoryListFetcher = async () => {
    try {
      const resp = await axios.get('/categories');
      setCategoryList(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const saveCategory = async () => {
    const jwt = localStorage.getItem('jwt');
    const api = `/admin/category`;
    const payload = { "carType": carType, "isVisible": true };

    try {
      const response = await axios.post(api, payload, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log('Successfully:', response.data);
      toast.success("Successfully Category Added")
      setCategoryList((prev) => [...prev, response.data]);
      setCarType('');
    } catch (error) {
      toast.error("Error unable to Add New Category ",error.data);
      console.log('Error:', error);
    }
  };

  const deleteCategory = async (categoryId) => {
    const jwt = localStorage.getItem('jwt');
    try {
      await axios.delete(`/admin/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      toast.success("Category Deleted Successfully")
      setCategoryList((prev) =>
        prev.map((cat) =>
          cat.categoryId === categoryId ? { ...cat, isVisible: false } : cat
        )
      );
    } catch (error) {
      toast.error("Error Category is Unable to Delete")
      console.log('Error deleting category:', error);
    }
  };

  const updateCategory = async () => {
    const jwt = localStorage.getItem('jwt');
    try {
      const response = await axios.put(
        `/admin/category/${editingCategory.categoryId}`,
        { carType: editingCategory.carType },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      console.log('Successfully updated:', response.data);
      toast.success("Category Updated Successfully")
      setCategoryList((prev) =>
        prev.map((cat) => (cat.categoryId === editingCategory.categoryId ? response.data : cat))
      );
      setEditingCategory(null);
    } catch (error) {
      toast.error("Error Unable to Update the Category")
      console.log('Error updating category:', error);
    }
  };

  useEffect(() => {
    categoryListFetcher();
  }, []);

  const filteredCategories = categoryList.filter(
    (category) => (viewMode === 'current' ? category.isVisible : !category.isVisible)
  );

  return (
    <div>
    <div className='category-page'>
      <h1>Add New Category</h1>
      <div className="adding-new-category">
        <label htmlFor="category">New Category:</label>
        <input
          id="category"
          type="text"
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
        />
        <button onClick={saveCategory}>Save</button>
      </div>

      <div className="view-mode-controls">
        <label>
          <input
            type="radio"
            name="viewMode"
            checked={viewMode === 'current'}
            onChange={() => setViewMode('current')}
          />{' '}
          Current Live Categories
        </label>
        <label>
          <input
            type="radio"
            name="viewMode"
            checked={viewMode === 'discontinued'}
            onChange={() => setViewMode('discontinued')}
          />{' '}
          Discontinued Categories
        </label>
      </div>

      <h2>Categories</h2>
      <table className="category-table">
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Car Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category.categoryId}>
              <td>{category.categoryId}</td>
              <td>{category.carType}</td>
              <td className='category-button'>
                <button onClick={() => setEditingCategory(category)}>Update</button>
                {viewMode === 'current' && (
                  <button onClick={() => deleteCategory(category.categoryId)} className='delete'>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingCategory && (
        <div className="popup">
          <h2>Update Category</h2>
          <label>Car Type:</label>
          <input
            type="text"
            value={editingCategory.carType}
            onChange={(e) => setEditingCategory({ ...editingCategory, carType: e.target.value })}
          />
          <div className="popup-buttons">
            <button onClick={updateCategory}>Save</button>
            <button onClick={() => setEditingCategory(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default AddCategory;



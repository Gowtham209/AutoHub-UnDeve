import React from 'react'
import axios from '../../utility/axios';
import authorize from '../../utility/Authorizer';
import userIdExtract from '../../utility/userIdExtractor';
import roleExtract from '../../utility/roleExtractor'
import  { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import './DashBoard.css'
import { toast } from 'react-toastify';

function DashBoard() {
  const [carList, setCarList] = useState([]);
  const [mainCarList, setMainCarList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTypedCar, setSearchTypedCar] = useState('');
  const [viewMode, setViewMode] = useState('current'); // 'current' or 'discontinued'
  const [editingCar, setEditingCar] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [category,setCategory]=useState('');
  const categoryListFetcher = async () => {
    try {
      const resp = await axios.get('/categories');
      setCategoryList(resp.data);
    } catch (error) {
      console.log(error);
    }
  };
  const carListFetcher = async () => {
    try {
      const resp = await axios.get('/cars');
      setMainCarList(resp.data);
      setCarList(resp.data.filter(car => car.isVisible));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    categoryListFetcher();
    carListFetcher();
  }, []);

  useEffect(() => {
    if (!loading) {
      filterCars();
    }
  }, [searchTypedCar, viewMode]);

  const filterCars = () => {
    let filteredCars = mainCarList.filter(car => (viewMode === 'current' ? car.isVisible : !car.isVisible));

    if (searchTypedCar.trim() !== '') {
      filteredCars = filteredCars.filter(car =>
        car.modelName.toLowerCase().includes(searchTypedCar.toLowerCase())
      );
    }

    setCarList(filteredCars);
  };

  const handleDelete = async (modelId) => {
    try {
      const jwt = localStorage.getItem('jwt');
      const api=`/admin/car/${modelId}`;
      console.log("Delete is Triggered")
      const resp=await axios.delete(api,{
          headers: { 'Authorization': `Bearer ${jwt}` }
        });
      console.log("Response APi:",resp.data);
      toast.success("Successfully Car has been Deleted")
      setCarList(prev => prev.filter(car => car.modelId !== modelId));
    } catch (error) {
      console.log('Error deleting model:', error.response.data);
      toast.error(error.response.data)
    }
  };

  function updateCategory(e)
  {
      console.log("Category Updater:",e);
      editingCar.category.carType=e;
  }

  const handleSave = async (modelId) => {
    try {
      const jwt = localStorage.getItem('jwt');
      const api=`/admin/car/${modelId}`;
  
      console.log("Payload:",editingCar)

     const response=await axios.put(api, editingCar,{
          headers: { 'Authorization': `Bearer ${jwt}` }
        });
      console.log("After Update:",response.data)
      toast.success("Successfully Car Updated")
      setCarList(prev => prev.map(car => (car.modelId === editingCar.modelId ? editingCar : car)));
      setEditingCar(null);
    } catch (error) {
       toast.error("Error Updating mode");
    }
  };

  return (
    <>
    <h1>Dashboard</h1>
    <div className="controls">
        <label htmlFor="carmodel">Car Model:</label>
        <input
            id='carmodel'
            type="text"
            placeholder="Search by Model Name"
            value={searchTypedCar}
            onChange={(e) => setSearchTypedCar(e.target.value)}
        />
        <label>
            <input
                type="radio"
                name="viewMode"
                checked={viewMode === 'current'}
                onChange={() => setViewMode('current')}
            />{' '}
            Current Cars
        </label>
        <label>
            <input
                type="radio"
                name="viewMode"
                checked={viewMode === 'discontinued'}
                onChange={() => setViewMode('discontinued')}
            />{' '}
            Discontinued Cars
        </label>
    </div>

    {loading ? (
        <p>Loading cars...</p>
    ) : carList.length > 0 ? (
      <div className="car-table-container">
        <table className="car-table">
            <thead>
                <tr>
                    <th>Model ID</th>
                    <th>Model Name</th>
                    <th>Year</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Car Lots</th>
                    {viewMode === 'current' && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {carList.map((car) => (
                    <tr key={car.modelId}>
                        <td>{car.modelId}</td>
                        <td>{car.modelName}</td>
                        <td>{car.year}</td>
                        <td>{car.price}</td>
                        <td>{car.available ? 'Yes' : 'No'}</td>
                        <td>{car.carLots}</td>
                        {viewMode === 'current' && (
                            <td className='buttons'>
                                <button onClick={() => handleDelete(car.modelId)} id='delete'>Delete</button>
                                <button onClick={() => setEditingCar(car)}>Update</button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    ) : (
        <p>No cars found.</p>
    )}

    {editingCar && (
      <div className='popup-background'>
        <div className="popup">
            <h2>Update Car Model</h2>
            <label>Model Name:
                <input
                    type="text"
                    value={editingCar.modelName}
                    onChange={(e) => setEditingCar({ ...editingCar, modelName: e.target.value })}
                />
            </label>
            <label>Category:
    <select
        value={editingCar.category.categoryId || ""}
        onChange={(e) => {
            const selectedCategory = categoryList.find(cat => cat.categoryId === parseInt(e.target.value));
            setEditingCar({
                ...editingCar,
                category: selectedCategory
            });
        }}
    >
        <option value="">Select Category</option>
        {categoryList.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
                {cat.carType}
            </option>
        ))}
    </select>
</label>
           
            <label>Year:
                <input
                    type="number"
                    value={editingCar.year}
                    onChange={(e) => setEditingCar({ ...editingCar, year: e.target.value })}
                />
            </label>
            <label>Price:
                <input
                    type="number"
                    value={editingCar.price}
                    onChange={(e) => setEditingCar({ ...editingCar, price: e.target.value })}
                />
            </label>
            <label>Available:
                <input
                    type="checkbox"
                    checked={editingCar.available}
                    onChange={(e) => setEditingCar({ ...editingCar, available: e.target.checked })}
                />
            </label>
            <label>Car Lots:
                <input
                    type="number"
                    value={editingCar.carLots}
                    onChange={(e) => setEditingCar({ ...editingCar, carLots: e.target.value })}
                />
            </label>
            <div className="update-buttons">
            <button onClick={() => handleSave(editingCar.modelId)}>Save</button>
            <button onClick={() => setEditingCar(null)} className='cancel'>Cancel</button>
            </div>
        </div>
        </div>
    )}
</>
  );
}

export default DashBoard;

 
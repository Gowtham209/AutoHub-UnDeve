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
import './UserHome.css'

function UserHome() {
  const navigate = useNavigate();
  const jwtToken=localStorage.getItem('jwt');
  

  const [carList, setCarList] = useState([]);
  const [mainCarList, setMainCarList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [searchTypedCar, setSearchTypedCar] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    carListFetcher();
    categoryListFetcher();
  }, []);

  const categoryListFetcher = async () => {
    try {
      const resp = await axios.get("/categories");
      setCategoryList(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const carListFetcher = async () => {
    try {
      const resp = await axios.get("/cars");
      setMainCarList(resp.data);
      setCarList(resp.data);
      setLoading(false);    
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) { 
      filterCars();
    }
  }, [searchTypedCar, selectedCategory]);

  const filterCars = () => {
    let filteredCars = mainCarList;

    if (selectedCategory !== 'All') {
      filteredCars = filteredCars.filter(
        (car) => car.category.carType.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTypedCar.trim() !== '') {
      filteredCars = filteredCars.filter((car) =>
        car.modelName.toLowerCase().includes(searchTypedCar.toLowerCase())
      );
    }

    setCarList(filteredCars);
  };

  return (
    <div className="base-page">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by Model Name"
          value={searchTypedCar}
          onChange={(e) => setSearchTypedCar(e.target.value)}
        />
      </div>

      <div className="category-drop-down">
        <label htmlFor="category">Choose a Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          {categoryList.map((obj) => (
            <option key={obj.categoryId} value={obj.carType}>
              {obj.carType}
            </option>
          ))}
        </select>
      </div>

      <div className="grid">
        {loading ? (
          <p>Loading cars...</p> 
        ) : carList.length > 0 ? (
          carList.map((obj) => obj.isVisible && <Tile key={obj.modelId} props={obj} />)
        ) : (
          <p>No cars found.</p>
        )}
      </div>
    </div>
  );
}

export default UserHome;



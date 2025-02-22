import React, { useRef } from 'react'
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from '../utility/axios';
import { useNavigate } from 'react-router-dom';
import './CarDetail.css'
import {createCarImage} from '../utility/createcar';

function CarDetail() {
    
    const { carModelId } = useParams();
    const[data,setData]=useState([]);
    const[carImg,setCarImg]=useState({});
    const navigate = useNavigate();
    let make=useRef('');
    let model=useRef('');

    const jwtToken=localStorage.getItem('jwt');
    function buyPage()
    {
      if(jwtToken.length==1)
      navigate(`/buy/${carModelId}`)
      else
      navigate(`/user/buy/${carModelId}`)
    }
    function bookTestDrivePage()
    {
      if(jwtToken.length==1)
      navigate(`/test-drive/${carModelId}`)
      else
      navigate(`/user/test-drive/${carModelId}`)
    }
    const dataFetcher = async ()=>
    {
    try {
    const api=`/car/${carModelId}`;
    const resp=await axios.get(api);
    const json=resp.data;
    setData(json);
    console.log(json)
    const car=json.modelName.split(" ");
    make.current=car[0];
    model.current=car[1];

    } catch (error) {
      console.log(error)
    }
    }

  useEffect(()=>{
    dataFetcher();
  },[])


  console.log(carModelId);
  return (
    <div className='car-detail-page'>
      <div className="image">

      <img
      src={createCarImage(
        {
          make: make.current,
          model: model.current,
          year: data.year
        },
        ""
      )}
      alt="Car Image Angle 0"
    />

 </div>
      
      <div className="car-content">
      <h1>Car Detail</h1>
        <h2>Model : {data.modelName}</h2>
        <h2>Price : {data.price}</h2>
        <h2>Year : {data.year}</h2>
        <h2>Total Piece : {data.carLots}</h2>
        <h2>In Stock : {data.available ? "Available" : "Not Available"}</h2>
        <div className="buy-book-buttons car-detail-buttons">
        <button onClick={bookTestDrivePage}>Book Test Drive</button>
        <button onClick={buyPage} className='buy-button'>Buy</button>
        </div>
      </div>
        
    </div>
  )
}

export default CarDetail
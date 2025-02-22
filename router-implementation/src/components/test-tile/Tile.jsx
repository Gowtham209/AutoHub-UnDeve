import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import './Tile.css'
import { useNavigate } from 'react-router-dom';
import {createCarImage} from '../utility/createcar';

function Tile({props}) {
    const [avaliable,setAvaliable]=useState('');
    const navigate = useNavigate();

    const jwtToken=localStorage.getItem('jwt');
    


    function detailPageRoute()
    {
        if(jwtToken.length==1)
        navigate(`/cardetail/${props.modelId}`)
        else
        navigate(`/user/cardetail/${props.modelId}`)
    }
    useEffect(()=>{
        if(props.available==true)
            setAvaliable('Available')
        else
        setAvaliable('Not - Available')
    },[])
    function buyPage()
    {
    
      if(jwtToken.length==1)
      navigate(`/buy/${props.modelId}`)
      else
      navigate(`/user/buy/${props.modelId}`)
    }
    function bookTestDrivePage(e)
    {

      if(jwtToken.length==1)
      navigate(`/test-drive/${props.modelId}`)
      else
      navigate(`/user/test-drive/${props.modelId}`)
    }


const car = props.modelName.split(" ");
console.log("Image:\nMake:",car[0],"\nModel:",car[1]);
const carImg = {
  make: car[0],
  model: car[1],
  year: props.year
};


  return (
 <div className='tile' onClick={detailPageRoute}>
  <div className="image">
  <img src={createCarImage(carImg, "")} alt="Car Image Angle 0"  />
  </div>
  <h3 className='model'>{props.modelName}</h3>
  <h3>Price : {props.price}</h3>
  <h3>Year : {props.year}</h3>

  <h3>In Stock : {avaliable}</h3>

  <div className="buy-book-buttons">
    <button onClick={(e) => { e.stopPropagation(); bookTestDrivePage(); }}>Book Test Drive</button>
    <button onClick={(e) => { e.stopPropagation(); buyPage(); }} className='buy-button'>Buy</button>
  </div>
</div> 
  )
}

export default Tile
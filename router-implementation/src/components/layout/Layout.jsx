import React, { useEffect } from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../header/Header'
import  { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
function Layout() {
  
  return (
    <>
    <Header />
    <Outlet />
    </>
  )
}

export default Layout
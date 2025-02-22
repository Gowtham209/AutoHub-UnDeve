import React from 'react'
import {Outlet} from 'react-router-dom'
import AdminHeader from './admin-header/AdminHeader'
import  { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function AdminLayout() {
  const navigate = useNavigate();
  const jwt=localStorage.getItem('jwt');
useEffect(() => {
  if (jwt === null) {
    toast.error("Please Login to Access the Service");
    navigate('/login');
    return;
  }

  const decodedToken = jwtDecode(jwt);
  const role = decodedToken.role;

  if (role !== 1) {
    toast.error("UnAuthorized");
    navigate('/unAuthorized');
  }
}, [jwt, navigate]);
  return (
    <>
    <AdminHeader />
    <Outlet />
    </>
  )
}

export default AdminLayout
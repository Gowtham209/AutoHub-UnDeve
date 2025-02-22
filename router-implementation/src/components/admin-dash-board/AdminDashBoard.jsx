import React from 'react'
import { useNavigate } from 'react-router-dom';
import './AdminDashBoard.css'
import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';

import AddCategory from '../admin/add-category/AddCategory.jsx'
import AddCarModel from '../admin/add-car/AddCarModel.jsx';
import ListCustomers from '../admin/list-customers/ListCustomers.jsx';
import ListOrders from '../admin/list-orders/ListOrders.jsx';
import DashBoard from '../admin/list-cars/DashBoard.jsx';
import BuyOrderList from '../admin/buy-order-list/BuyOrderList.jsx';
function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'addCategory':
        return <AddCategory />;
      case 'addCarModel':
        return <AddCarModel />;
      case 'listCustomers':
        return <ListCustomers />;
      case 'listOrders':
        return <BuyOrderList />;
      case 'listTestDrives':
        return <ListOrders />;
      default:
        return <DashBoard/>;
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => setActiveSection('dashboard')}>Dashboard</li>
          <li onClick={() => setActiveSection('addCategory')}>Add Category</li>
          <li onClick={() => setActiveSection('addCarModel')}>Add Car Model</li>
          <li onClick={() => setActiveSection('listCustomers')}>List Customers</li>
          <li onClick={() => setActiveSection('listOrders')}>View Orders</li>
          <li onClick={() => setActiveSection('listTestDrives')}>Test Drive Bookings</li>
        </ul>
      </nav>

      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;
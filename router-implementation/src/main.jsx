import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './components/home/Home.jsx';
import UserHome from './components/user/home/UserHome.jsx';
import About from './components/about/About.jsx';
import Login from './components/login/Login.jsx';
import SignUp from './components/signup/SignUp.jsx';
import UserLayout from './components/user/UserLayout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Profile from './components/admin/profile/Profile.jsx';
import UnAuthorized from './components/error/UnAuthorized.jsx';
import NotFound from './components/error/NotFound.jsx';
import CarDetail from './components/car-detail/CarDetail.jsx';
import TestDriveBooking from './components/test-drive-book/TestDriveBooking.jsx';
import BuyPage from './components/buy/BuyPage.jsx';
import AdminDashBoard from './components/admin-dash-board/AdminDashBoard.jsx';
import AddCar from './components/admin/add-car/AddCarModel.jsx';
import Address from './components/address/Address.jsx';
import Orders from './components/user/orders/Orders.jsx';
import TestDriveBookingsList from './components/user/test-drive-booking-list/TestDriveBookingsList.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const routerObj = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />}>
        <Route index element={<UserHome />} />
        <Route path='home' element={<UserHome />} />
        <Route path='about' element={<About />} />
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='test-drive/:carModelId' element={<TestDriveBooking />} />
        <Route path='buy/:carModelId' element={<BuyPage />} />
        <Route path='cardetail/:carModelId' element={<CarDetail />} />
      </Route>

      <Route path='/admin' element={<AdminLayout />}>
        <Route index element={<Navigate to='/dash-board' />} />
        <Route path='dash-board' element={<AdminDashBoard />} />
        <Route path='add-car' element={<AddCar />} />
        <Route path='profile' element={<Profile />} />
        <Route path='address' element={<Address />} />
      </Route>

      <Route path='/user' element={<UserLayout />}>
        <Route path='cardetail/:carModelId' element={<CarDetail />} />
        <Route path='test-drive/:carModelId' element={<TestDriveBooking />} />
        <Route path='buy/:carModelId' element={<BuyPage />} />
        <Route path='test-drive-bookings' element={<TestDriveBookingsList />} />
        <Route path='orders' element={<Orders />} />
        <Route path='userhome' element={<UserHome />} />
        <Route path='profile' element={<Profile />} />
        <Route path='address' element={<Address />} />
      </Route>

      {/* Global 404 'page not found' Route */}
      <Route path="*" element={<NotFound />} />
      {/* UNAUTHORIZED */}
      <Route path="unAuthorized" element={<UnAuthorized />} />
    </>
  )
);

createRoot(document.getElementById('app')).render(
  <StrictMode>
    <RouterProvider router={routerObj} />
    <ToastContainer />
  </StrictMode>,
);
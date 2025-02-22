import React from 'react'
import './UserHeader.css'
import { Link,NavLink } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faRightFromBracket,faCarSide,faFileInvoice} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function UserHeader() {
   const navigate = useNavigate();
  function logout()
  {
    localStorage.setItem('jwt',null);
    console.log("LogOut")
    navigate('/login')
  }
  return (
    <nav className='user-header'>
         <Link to='userhome' className='logo'>AutoHub</Link>

          <div className="orders-test-drive-list">
          <Link to='test-drive-bookings' className='test-drive'><FontAwesomeIcon icon={faCarSide} style={{color: "#fafafa",}} /></Link>
          <Link to='orders' className='order'><FontAwesomeIcon icon={faFileInvoice} style={{color: "#ffffff",}} /></Link>
          </div>
         <div className="profile-logout-box">
         <Link to='profile' className='user'>
          <FontAwesomeIcon icon={faUser} style={{color: "#ffffff"}} />
          </Link>
          <FontAwesomeIcon icon={faRightFromBracket} style={{color: "#ffffff"}} onClick={logout} className='logout'/>
         </div>
    </nav>
  )
}

export default UserHeader
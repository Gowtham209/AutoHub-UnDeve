import React from 'react'
import { Link,NavLink } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css'
function AdminHeader() {
  const navigate = useNavigate();
  function logout()
  {
    localStorage.setItem('jwt',null);
    navigate('/login')
  }
  return (
    <nav className='admin-header'>
         <Link to='dash-board' className='logo'>AutoHub</Link>

        <div className="profile-logout-box">
        <Link to='profile' className='admin-logo'> <FontAwesomeIcon icon={faUser} style={{color: "#ffffff"}} /></Link>

<FontAwesomeIcon icon={faRightFromBracket} style={{color: "#ffffff"}} onClick={logout} className='logout'/>
        </div>
    </nav>
  )
}

export default AdminHeader
import React from 'react'
import { Link,NavLink } from "react-router";
import './UnAuthorized.css';
import { useNavigate } from "react-router-dom";

function UnAuthorized() {
  const navigate = useNavigate();
    return (
        <div className="unauthorized-container">
         
           <div className="content-box">
           <h1 className="title">403 - Unauthorized</h1>
            <p className="message">You do not have permission to view this page.</p>
            <button
                onClick={() => navigate("/login")}
                className="button"
            >
                Go to Home
            </button>
           </div>
        </div>
    );
};

export default UnAuthorized
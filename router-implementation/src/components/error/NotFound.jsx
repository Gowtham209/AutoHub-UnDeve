import React from 'react'
import './NotFound.css'
import { useNavigate } from "react-router-dom";


const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="page-not-found-container">
         
           <div className="content-box">
           <h1 className="title">404 - Page Not Found</h1>
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
 
export default NotFound;
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from '../../utility/axios';
import  { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
function Orders() {
    const [purchases, setPurchases] = useState([]);
    const [filter, setFilter] = useState('bought');
  
    useEffect(() => {
      async function fetchPurchases() {
        const jwt = localStorage.getItem('jwt');
        const decodedToken = jwtDecode(jwt);
        const userId = decodedToken.userId;
        const api = `/user/${userId}/car-purchase-bookings`;
  
        try {
          const response = await axios.get(api, {
            headers: { 'Authorization': `Bearer ${jwt}` }
          });
          setPurchases(response.data);
        } catch (error) {
          console.error('Error fetching purchases:', error);
          alert('Error fetching purchases.');
        }
      }
  
      fetchPurchases();
    }, []);
  
    const handleCancel = async (purchaseId) => {
      const jwt = localStorage.getItem('jwt');
      const decodedToken = jwtDecode(jwt);
      const userId = decodedToken.userId;
      const api = `/user/${userId}/car-purchase-booking/${purchaseId}`;
  
      try {
        await axios.delete(api, {
          headers: { 'Authorization': `Bearer ${jwt}` }
        });
        toast.success("Successfully Car Order Cancelled")
        // Update the specific purchase visibility
        setPurchases(prevPurchases =>
          prevPurchases.map(purchase =>
            purchase.purchaseId === purchaseId
              ? { ...purchase, isVisible: false }
              : purchase
          )
        );
  
        
      } catch (error) {
        console.error('Error cancelling purchase:', error);
        toast.error('Error cancelling the purchase.',error.data);
      }
    };
  
    const filteredPurchases = purchases.filter(purchase =>
      filter === 'bought' ? purchase.isVisible : !purchase.isVisible
    );
  
    return (
      <div className="container">
        <div className="filter-options">
          <label>
            <input
              type="radio"
              value="bought"
              checked={filter === 'bought'}
              onChange={() => setFilter('bought')}
            /> Bought
          </label>
          <label>
            <input
              type="radio"
              value="cancelled"
              checked={filter === 'cancelled'}
              onChange={() => setFilter('cancelled')}
            /> Cancelled
          </label>
        </div>
  
        <table className="table">
          <thead className="table-head">
            <tr>
              <th>Purchase ID</th>
              <th>Model Name</th>
              <th>Bought Date</th>
              <th>Delivery Date</th>
              <th>Quantity</th>
              <th>Final Purchase Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map((purchase) => (
              <tr key={purchase.purchaseId} className="table-row">
                <td>{purchase.purchaseId}</td>
                <td>{purchase.model.modelName}</td>
                <td>{new Date(purchase.bookedDate).toLocaleString()}</td>
                <td>{new Date(purchase.deliveryDate).toLocaleString()}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.finalPurchaseAmount.toLocaleString()}</td>
                <td>
                  <button
                    className="cancel-button"
                    onClick={() => handleCancel(purchase.purchaseId)}
                    disabled={!purchase.isVisible}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default Orders;


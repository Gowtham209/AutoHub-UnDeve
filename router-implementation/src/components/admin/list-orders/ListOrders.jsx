import React from 'react'
import { useState ,useEffect} from 'react';
import axios from '../../utility/axios';
import { toast } from 'react-toastify';
import './ListOrders.css'
function ListOrders() {
  const [testDriveBookingOrders, setTestDriveBookingOrders] = useState([]);
  const [mainOrderList, setMainOrderList] = useState([]);
  const [searchCarModelName, setSearchCarModelName] = useState('');
  const [viewMode, setViewMode] = useState('active'); // 'active', 'delivered', or 'cancelled'
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const jwt = localStorage.getItem('jwt');
      const apibuild = '/admin/test-drive-bookings';
      const resp = await axios.get(apibuild, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      const json = resp.data;
      console.log("order list:", json);
      setMainOrderList(json);
      filterOrders(json);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!loading) {
      filterOrders(mainOrderList);
    }
  }, [searchCarModelName, viewMode]);

  const filterOrders = (orders) => {
    let filteredOrders = orders.filter(order => {
      if (viewMode === 'active') return !order.driveCompleted && order.isVisible;
      if (viewMode === 'delivered') return order.driveCompleted;
      if (viewMode === 'cancelled') return !order.isVisible;
      return true;
    });

    if (searchCarModelName.trim() !== '') {
      filteredOrders = filteredOrders.filter(order =>
        order.user.userName.toLowerCase().includes(searchCarModelName.toLowerCase())
      );
    }

    setTestDriveBookingOrders(filteredOrders);
  };

  const handleCompleteDelivery = async (orderId) => {
    try {
      const jwt = localStorage.getItem('jwt');
      console.log("Complete Button Hit");
      const api = `/admin/test-drive-bookings/${orderId}`;
      const payload = { driveCompleted: true };
      await axios.put(api, payload, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      toast.success("Successfully Buy Order Delivered");
      setTestDriveBookingOrders(prev => prev.filter(order => order.testDriveBookId !== orderId));
    } catch (error) {
      toast.error("Error Unable to Deliver the Buy Order");
      console.log('Error completing delivery:', error);
    }
  };

  return (
    <>
      <h1>List of Test Driving Booking Orders</h1>
      <div className="controls">
        <label htmlFor="customername">Customer Name:</label>
        <input
          id='customername'
          type="text"
          placeholder="Search by Customer Name"
          value={searchCarModelName}
          onChange={(e) => setSearchCarModelName(e.target.value)}
        />
        <label htmlFor="viewMode">View Mode:</label>
        <select
          id="viewMode"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
        >
          <option value="active">Active Orders</option>
          <option value="delivered">Delivered Orders</option>
          <option value="cancelled">Cancelled Orders</option>
        </select>
      </div>

      {loading ? (
        <p>Loading testDriveBookingOrders...</p>
      ) : testDriveBookingOrders.length > 0 ? (
        <table className="order-table">
          <thead>
            <tr>
              <th>Tst Drv Bk Order ID</th>
              <th>User Name</th>
              <th>Model Car</th>
              <th>Delivery Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testDriveBookingOrders.map((order) => (
              <tr key={order.testDriveBookId}>
                <td>{order.testDriveBookId}</td>
                <td>{order.user.userName}</td>
                <td>{order.model.modelName}</td>
                <td>{order.testDriveDate}</td>
                <td>
                  {viewMode === 'active' && (
                    <button onClick={() => handleCompleteDelivery(order.testDriveBookId)}>Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No testDriveBookingOrders found.</p>
      )}
    </>
  );
}

export default ListOrders;

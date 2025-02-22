import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState ,useEffect} from 'react';
import axios from '../../utility/axios';
import { toast } from 'react-toastify';

import './ListCustomers.css'
function ListCustomers() {
  const [customers, setCustomers] = useState([]);
  const [mainCustomerList, setMainCustomerList] = useState([]);
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [viewMode, setViewMode] = useState('active'); // 'active' or 'removed'
  const [loading, setLoading] = useState(true);

  async function fetchCustomers() {
    try {
      const jwt = localStorage.getItem('jwt');
      const apibuild = '/admin/users';
      const resp = await axios.get(apibuild, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      const json = resp.data;
      setMainCustomerList(json);
      setLoading(false);
      filterCustomer(json); // Call filterCustomer with the fetched data
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (!loading) {
      filterCustomer(mainCustomerList);
    }
  }, [searchCustomerName, viewMode]);

  const filterCustomer = (customers) => {
    let filteredCustomer = customers.filter(cust => (viewMode === 'active' ? cust.isVisible : !cust.isVisible));

    if (searchCustomerName.trim() !== '') {
      filteredCustomer = filteredCustomer.filter(cust =>
        cust.userName.toLowerCase().includes(searchCustomerName.toLowerCase())
      );
    }

    setCustomers(filteredCustomer);
  };

  const handleDelete = async (userId) => {
    try {
      const jwt = localStorage.getItem('jwt');
      console.log("Delete Button Hit");
      const api = `/admin/user/${userId}`;
      await axios.delete(api, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      toast.success("Successfully Removed Customer");
      setCustomers(prev => prev.filter(cust => cust.userId !== userId));
    } catch (error) {
      toast.error("Error Unable to Remove Customer");
      console.log('Error deleting user:', error);
    }
  };

  return (
    <>
      <h1>List of Customers</h1>
      <div className="controls">
        <label htmlFor="customername">Customer Name:</label>
        <input
          id='customername'
          type="text"
          placeholder="Search by Customer Name"
          value={searchCustomerName}
          onChange={(e) => setSearchCustomerName(e.target.value)}
        />
        <label>
          <input
            type="radio"
            name="viewMode"
            checked={viewMode === 'active'}
            onChange={() => setViewMode('active')}
          />{' '}
          Active Customers
        </label>
        <label>
          <input
            type="radio"
            name="viewMode"
            checked={viewMode === 'removed'}
            onChange={() => setViewMode('removed')}
          />{' '}
          Removed Customers
        </label>
      </div>

      {loading ? (
        <p>Loading customers...</p>
      ) : customers.length > 0 ? (
        <table className="customer-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>User Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.userId}>
                <td>{cust.userId}</td>
                <td>{cust.userName}</td>
                <td>{cust.emailId}</td>
                <td>{cust.userRole}</td>
                <td>
                  {
                    cust.isVisible &&
                    <button disabled={cust.userRole === 1} onClick={() => handleDelete(cust.userId)}>Delete</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No customers found.</p>
      )}
    </>
  );
}

export default ListCustomers;

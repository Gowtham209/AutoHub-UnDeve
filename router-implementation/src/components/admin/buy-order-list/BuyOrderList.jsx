import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState ,useEffect} from 'react';
import axios from '../../utility/axios';
import { toast } from 'react-toastify';

function BuyOrderList() {
  const [carBuyOrderList, setCarBuyOrdersList] = useState([]);
  const [mainOrderList, setMainOrderList] = useState([]);
  const [searchCarModelName, setSearchCarModelName] = useState('');
  const [viewMode, setViewMode] = useState('active'); // 'active', 'delivered', or 'cancelled'
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    try {
      const jwt = localStorage.getItem('jwt');
      const apibuild = '/admin/car-purchase-bookings';
      const resp = await axios.get(apibuild, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      const json = resp.data;
      console.log("order list:", json);
      setMainOrderList(json);
      setLoading(false);
      filterOrders(json); // Call filterOrders with the fetched data
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
      if (viewMode === 'active') return !order.isDelivered && order.isVisible;
      if (viewMode === 'delivered') return order.isDelivered && order.isVisible;
      return true;
    });

    if (searchCarModelName.trim() !== '') {
      filteredOrders = filteredOrders.filter(order =>
        order.user.userName.toLowerCase().includes(searchCarModelName.toLowerCase())
      );
    }

    setCarBuyOrdersList(filteredOrders);
  };

  const handleCompleteDelivery = async (orderId) => {
    try {
      const jwt = localStorage.getItem('jwt');
      console.log("Complete Button Hit");
      const api = `/admin/car-purchase-booking/${orderId}`;
      const payload = { isDelivered: true };
      await axios.put(api, payload, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      toast.success("Completed Buy Order Delivery");
      setMainOrderList(prev => prev.map(order => 
        order.purchaseId === orderId ? { ...order, isDelivered: true } : order
      ));
      filterOrders(mainOrderList);
    } catch (error) {
      toast.error('Error completing delivery:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const jwt = localStorage.getItem('jwt');
      console.log("Delete Button Hit");
      const api = `/admin/car-purchase-booking/${orderId}`;
      await axios.delete(api, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      toast.success("Deleted Buy Order");
      setMainOrderList(prev => prev.map(order => 
        order.purchaseId === orderId ? { ...order, isVisible: false } : order
      ));
      filterOrders(mainOrderList);
    } catch (error) {
      toast.error('Error deleting order:', error);
    }
  };

  return (
    <>
      <h1>List of Buy Orders</h1>
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
        </select>
      </div>

      {loading ? (
        <p>Loading carBuyOrderList...</p>
      ) : carBuyOrderList.length > 0 ? (
        <table className="order-table">
          <thead>
            <tr>
              <th>Buy Order ID</th>
              <th>User Name</th>
              <th>Model Car</th>
              <th>Delivery Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {carBuyOrderList.map((order) => (
              <tr key={order.purchaseId}>
                <td>{order.purchaseId}</td>
                <td>{order.user.userName}</td>
                <td>{order.model.modelName}</td>
                <td>{order.deliveryDate}</td>
                <td>
                  {viewMode === 'active' && (
                    <>
                      <button onClick={() => handleCompleteDelivery(order.purchaseId)}>Complete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No carBuyOrderList found.</p>
      )}
    </>
  );
}

export default BuyOrderList;
// function BuyOrderList() {
//   const [carBuyOrderList, setCarBuyOrdersList] = useState([]);
//   const [mainOrderList, setMainOrderList] = useState([]);
//   const [searchCarModelName, setSearchCarModelName] = useState('');
//   const [viewMode, setViewMode] = useState('active'); // 'active', 'delivered', or 'cancelled'
//   const [loading, setLoading] = useState(true);

//   async function fetchOrders() {
//     try {
//       const jwt = localStorage.getItem('jwt');
//       const apibuild = '/admin/car-purchase-bookings';
//       const resp = await axios.get(apibuild, {
//         headers: {
//           'Authorization': `Bearer ${jwt}`
//         }
//       });
//       const json = resp.data;
//       console.log("order list:", json);
//       setMainOrderList(json);
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     if (!loading) {
//       filterOrders();
//     }
//   }, [searchCarModelName, viewMode]);

//   const filterOrders = () => {
//     let filteredOrders = mainOrderList.filter(order => {
//       if (viewMode === 'active') return !order.isDelivered && order.isVisible;
//       if (viewMode === 'delivered') return order.isDelivered && order.isVisible;
//       if (viewMode === 'cancelled') return !order.isVisible;
//       return true;
//     });

//     if (searchCarModelName.trim() !== '') {
//       filteredOrders = filteredOrders.filter(order =>
//         order.user.userName.toLowerCase().includes(searchCarModelName.toLowerCase())
//       );
//     }

//     setCarBuyOrdersList(filteredOrders);
//   };

//   const handleCompleteDelivery = async (orderId) => {
//     try {
//       const jwt = localStorage.getItem('jwt');
//       console.log("Complete Button Hit");
//       const api = `/admin/car-purchase-booking/${orderId}`;
//       const payload = { isDelivered: true };
//       await axios.put(api, payload, {
//         headers: { 'Authorization': `Bearer ${jwt}` }
//       });
//       toast.success("Completed Buy Order Delivery")
//       setCarBuyOrdersList(prev => prev.filter(order => order.testDriveBookId !== orderId));
//     } catch (error) {
//       toast.error('Error completing delivery:', error);
//     }
//   };

//   return (
//     <>
//       <h1>List of Buy Orders</h1>
//       <div className="controls">
//         <label htmlFor="customername">Customer Name:</label>
//         <input
//           id='customername'
//           type="text"
//           placeholder="Search by Customer Name"
//           value={searchCarModelName}
//           onChange={(e) => setSearchCarModelName(e.target.value)}
//         />
//         <label htmlFor="viewMode">View Mode:</label>
//         <select
//           id="viewMode"
//           value={viewMode}
//           onChange={(e) => setViewMode(e.target.value)}
//         >
//           <option value="active">Active Orders</option>
//           <option value="delivered">Delivered Orders</option>
//           <option value="cancelled">Cancelled Orders</option>
//         </select>
//       </div>

//       {loading ? (
//         <p>Loading carBuyOrderList...</p>
//       ) : carBuyOrderList.length > 0 ? (
//         <table className="order-table">
//           <thead>
//             <tr>
//               <th>Buy Order ID</th>
//               <th>User Name</th>
//               <th>Model Car</th>
//               <th>Delivery Date</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {carBuyOrderList.map((order) => (
//               <tr key={order.purchaseId}>
//                 <td>{order.purchaseId}</td>
//                 <td>{order.user.userName}</td>
//                 <td>{order.model.modelName}</td>
//                 <td>{order.deliveryDate}</td>
//                 <td>
//                   {viewMode === 'active' && (
//                     <button onClick={() => handleCompleteDelivery(order.purchaseId)}>Complete</button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No carBuyOrderList found.</p>
//       )}
//     </>
//   );
// }

// export default BuyOrderList
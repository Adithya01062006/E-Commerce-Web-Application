import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { auth } = useAuth();
  const headers = { Authorization: `Bearer ${auth.token}` };

  const load = () =>
    axios.get('/api/orders', { headers }).then(r => setOrders(r.data));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`/api/orders/${id}/status`, { status }, { headers });
    load();
  };

  return (
    <div className="container">
      <h2 style={{ margin: '1rem 0' }}>All Orders</h2>
      <table>
        <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>#{o._id.slice(-6)}</td>
              <td>{o.user?.name} ({o.user?.email})</td>
              <td>${o.total.toFixed(2)}</td>
              <td>
                <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                  style={{ width: 'auto', margin: 0 }}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

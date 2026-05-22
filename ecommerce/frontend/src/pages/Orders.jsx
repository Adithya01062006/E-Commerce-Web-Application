import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    axios.get('/api/orders/mine', { headers: { Authorization: `Bearer ${auth.token}` } })
      .then(r => setOrders(r.data));
  }, []);

  return (
    <div className="container">
      <h2 style={{ margin: '1rem 0' }}>My Orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map(o => (
        <div className="card" key={o._id} style={{ marginBottom: '1rem' }}>
          <p><strong>Order #{o._id.slice(-6)}</strong> — <span>{o.status}</span></p>
          <p style={{ fontSize: '.85rem', color: '#666' }}>{new Date(o.createdAt).toLocaleDateString()}</p>
          <ul style={{ margin: '.5rem 0', paddingLeft: '1rem' }}>
            {o.items.map((i, idx) => (
              <li key={idx}>{i.product?.name || 'Product'} x{i.quantity} — ${(i.price * i.quantity).toFixed(2)}</li>
            ))}
          </ul>
          <strong>Total: ${o.total.toFixed(2)}</strong>
        </div>
      ))}
    </div>
  );
}

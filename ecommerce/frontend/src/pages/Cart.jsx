import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const checkout = async () => {
    if (!auth) return navigate('/login');
    const items = cart.map(i => ({ product: i._id, quantity: i.qty, price: i.price }));
    await axios.post('/api/orders', { items }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    clearCart();
    navigate('/orders');
  };

  if (!cart.length) return <div className="container"><p style={{ marginTop: '2rem' }}>Your cart is empty.</p></div>;

  return (
    <div className="container">
      <h2 style={{ margin: '1rem 0' }}>Cart</h2>
      <table>
        <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>
          {cart.map(i => (
            <tr key={i._id}>
              <td>{i.name}</td>
              <td>${i.price.toFixed(2)}</td>
              <td>{i.qty}</td>
              <td>${(i.price * i.qty).toFixed(2)}</td>
              <td><button className="danger" onClick={() => removeFromCart(i._id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: '1rem' }}>
        <strong>Total: ${total.toFixed(2)}</strong>
        <button onClick={checkout} style={{ marginLeft: '1rem' }}>Checkout</button>
      </div>
    </div>
  );
}

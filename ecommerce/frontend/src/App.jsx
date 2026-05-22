import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';

function PrivateRoute({ children, adminOnly }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" />;
  if (adminOnly && auth.role !== 'admin') return <Navigate to="/" />;
  return children;
}

export default function App() {
  const { auth, logout } = useAuth();
  const { cart } = useCart();

  return (
    <>
      <nav>
        <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>🛒 ShopKiro</Link>
        <div>
          <Link to="/">Products</Link>
          <Link to="/cart">Cart<span className="badge">{cart.length}</span></Link>
          {auth ? (
            <>
              <Link to="/orders">My Orders</Link>
              {auth.role === 'admin' && <Link to="/admin/products">Admin</Link>}
              <button onClick={logout} style={{ marginLeft: '1rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/admin/products" element={<PrivateRoute adminOnly><AdminProducts /></PrivateRoute>} />
        <Route path="/admin/orders" element={<PrivateRoute adminOnly><AdminOrders /></PrivateRoute>} />
      </Routes>
    </>
  );
}

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red', marginBottom: '.5rem' }}>{error}</p>}
      <label>Email</label>
      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
      <label>Password</label>
      <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
      <button type="submit" style={{ width: '100%' }}>Login</button>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>No account? <Link to="/register">Register</Link></p>
    </form>
  );
}

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/register', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red', marginBottom: '.5rem' }}>{error}</p>}
      <label>Name</label>
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <label>Email</label>
      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
      <label>Password</label>
      <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
      <button type="submit" style={{ width: '100%' }}>Register</button>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>Have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}

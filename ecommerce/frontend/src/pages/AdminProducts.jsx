import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const empty = { name: '', description: '', price: '', stock: '', image: '', category: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const { auth } = useAuth();
  const headers = { Authorization: `Bearer ${auth.token}` };

  const load = () => axios.get('/api/products').then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editing) {
      await axios.put(`/api/products/${editing}`, payload, { headers });
    } else {
      await axios.post('/api/products', payload, { headers });
    }
    setForm(empty);
    setEditing(null);
    load();
  };

  const del = async (id) => {
    if (confirm('Delete this product?')) {
      await axios.delete(`/api/products/${id}`, { headers });
      load();
    }
  };

  const edit = (p) => { setForm({ ...p, price: p.price, stock: p.stock }); setEditing(p._id); };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
        <h2>Manage Products</h2>
        <Link to="/admin/orders"><button>View Orders</button></Link>
      </div>
      <form onSubmit={submit} style={{ maxWidth: '100%', marginBottom: '2rem' }}>
        <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
        {['name', 'description', 'price', 'stock', 'image', 'category'].map(f => (
          <div key={f}>
            <label style={{ textTransform: 'capitalize' }}>{f}</label>
            <input value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
              required={['name', 'price', 'stock'].includes(f)} />
          </div>
        ))}
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" onClick={() => { setForm(empty); setEditing(null); }} style={{ marginLeft: '.5rem', background: '#888' }}>Cancel</button>}
      </form>
      <table>
        <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.stock}</td>
              <td>{p.category}</td>
              <td>
                <button onClick={() => edit(p)} style={{ marginRight: '.5rem' }}>Edit</button>
                <button className="danger" onClick={() => del(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

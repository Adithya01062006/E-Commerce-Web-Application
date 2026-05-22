import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('/api/products').then(r => setProducts(r.data));
  }, []);

  return (
    <div className="container">
      <h2 style={{ margin: '1rem 0' }}>Products</h2>
      <div className="grid">
        {products.map(p => (
          <div className="card" key={p._id}>
            {p.image && <img src={p.image} alt={p.name} />}
            <h3>{p.name}</h3>
            <p style={{ fontSize: '.85rem', color: '#666', margin: '.25rem 0' }}>{p.description}</p>
            <p className="price">${p.price.toFixed(2)}</p>
            <p style={{ fontSize: '.8rem', marginBottom: '.5rem' }}>Stock: {p.stock}</p>
            <button onClick={() => addToCart(p)} disabled={p.stock === 0}>
              {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

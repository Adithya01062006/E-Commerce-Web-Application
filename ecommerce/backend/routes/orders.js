const router = require('express').Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// POST /api/orders — place order
router.post('/', auth, async (req, res) => {
  try {
    const { items } = req.body;
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const order = await Order.create({ user: req.user.id, items, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/mine — user's orders
router.get('/mine', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('items.product', 'name price');
  res.json(orders);
});

// GET /api/orders — all orders (admin)
router.get('/', auth, admin, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').populate('items.product', 'name');
  res.json(orders);
});

// PUT /api/orders/:id/status (admin)
router.put('/:id/status', auth, admin, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(order);
});

module.exports = router;

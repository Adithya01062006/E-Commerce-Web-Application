require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const email = process.argv[2];
if (!email) { console.error('Usage: node makeAdmin.js <email>'); process.exit(1); }

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await User.updateOne({ email }, { $set: { role: 'admin' } });
  console.log(result.matchedCount ? `${email} is now admin` : 'User not found');
  process.exit(0);
});

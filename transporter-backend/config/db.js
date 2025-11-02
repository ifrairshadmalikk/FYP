// جہاں آپ DB connect کر رہے ہیں (src/config/db.js)
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/transporter_db';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB connected');
  console.log('DB name:', mongoose.connection.name);
  console.log('DB host:', mongoose.connection.host);
  console.log('DB port:', mongoose.connection.port);
  console.log('Ready state:', mongoose.connection.readyState); // 1 means connected
};

module.exports = { connectDB };

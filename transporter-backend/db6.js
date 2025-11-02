// test-db.js
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/transporter_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Check if polls collection exists and has data
    const polls = await mongoose.connection.db.collection('polls').find({}).toArray();
    console.log(`📊 Total polls in database: ${polls.length}`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:');
    collections.forEach(col => console.log(` - ${col.name}`));
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  }
}

testConnection();
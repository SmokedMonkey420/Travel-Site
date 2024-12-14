const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('your_mongodb_connection_string', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a test schema
const testSchema = new mongoose.Schema({
  name: String,
  timestamp: Date,
});

// Create a model
const TestModel = mongoose.model('Test', testSchema);

// Test Route
app.post('/test', async (req, res) => {
  try {
    const testData = new TestModel({
      name: 'Test Data',
      timestamp: new Date(),
    });

    const savedData = await testData.save();
    res.status(200).json({ success: true, data: savedData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Server is working');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

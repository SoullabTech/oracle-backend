import express from 'express';
const app = express();
const PORT = process.env.PORT || 10000;

// Simple middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Oracle Backend!');
});

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Log environment information
console.log('Environment variables:');
console.log(`PORT: ${process.env.PORT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// Wait a moment before starting the server
console.log('Waiting 3 seconds before starting server...');
setTimeout(() => {
  // Use 0.0.0.0 to bind to all available network interfaces
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
    console.log('Server is ready to accept connections');
  });
}, 3000);

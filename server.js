import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Your other imports...

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const allowedOrigins = [
  'https://your-frontend-domain.onrender.com', // Your frontend domain on Render
  'http://localhost:3000',                       // For local development
  // Add any other domains that should be allowed to access your API
];

const corsOptions = {
  origin: function (origin, callback) {  // <-- Notice the type annotations are removed
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS with specific options
app.use(cors(corsOptions));

// The rest of your code...

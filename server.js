import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Define allowed origins—replace these with your actual allowed domains
const allowedOrigins: string[] = [
  'https://your-frontend-domain.onrender.com', // Frontend domain on Render
  'http://localhost:3000',                       // For local development
  // Add any other domains that should be allowed to access your API
];

// Define CORS options using the CorsOptions type for better type safety
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware with your defined options
app.use(cors(corsOptions));

// The rest of your Express setup and routes...
app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ message: 'Backend is live' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

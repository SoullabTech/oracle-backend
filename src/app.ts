// src/app.ts

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { authenticate } from './middleware/authenticate;
import userProfileRouter from './routes/userProfile.routes;
// ... import other routers as needed

const app = express();
app.use(cors());
app.use(express.json());

// Mount the user profile route at /update-profile
app.use('/', userProfileRouter);

// (Optional) Swagger, health-check, and other routes here

// Example health-check
app.get('/', (_req, res) => {
  res.send('API is up and running');
});

export { app };

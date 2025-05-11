import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes'; // Path to your auth route file

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('POST /auth/login', () => {
  it('should return 200 with user data on successful login', async () => {
    // Mock the supabase client
    vi.mock('../../lib/supabase', () => ({
      supabase: {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: { user: { id: '123', email: 'test@example.com' }, session: { access_token: 'token123', refresh_token: 'refresh123' } },
            error: null,
          }),
        },
      },
    }));

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.session.accessToken).toBe('token123');
  });

  it('should return 401 if login fails', async () => {
    // Mock error response for login failure
    vi.mock('../../lib/supabase', () => ({
      supabase: {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Authentication failed' },
          }),
        },
      },
    }));

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication failed');
  });
});

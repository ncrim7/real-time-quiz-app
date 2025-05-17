const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Auth API', () => {
  test('POST /api/auth/register - Yeni kullanıcı kaydı', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: '123456',
        role: 'student'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/auth/login - Geçersiz şifre', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toBe(400);
  });
});
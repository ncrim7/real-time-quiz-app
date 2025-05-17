const request = require('supertest');
const app = require('../app');
const Quiz = require('../models/Quiz');

describe('Quiz API', () => {
  let token;

  beforeAll(async () => {
    // Test kullanıcısı ile giriş yapıp token al
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: '123456'
      });
    token = res.body.token;
  });

  test('POST /api/quizzes - Quiz oluşturma (Öğretmen rolü gerektirir)', async () => {
    const res = await request(app)
      .post('/api/quizzes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "Test Quiz",
        questions: [{ text: "Test sorusu?", options: ["A", "B"], correctAnswer: 0 }]
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title');
  });
});
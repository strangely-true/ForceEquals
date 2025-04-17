const request = require('supertest');
const app = require('../app');

describe('Target Account Matching API', () => {
  let token;

  // 🔐 Test Login
  test('POST /login - success', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'user1', password: 'pass123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('POST /login - failure', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'wrong', password: 'wrong' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  // 📄 Test GET /accounts
  test('GET /accounts - with valid token', async () => {
    const res = await request(app)
      .get('/accounts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /accounts - without token', async () => {
    const res = await request(app).get('/accounts');
    expect(res.statusCode).toBe(401);
  });

  // ✏️ Test POST /accounts/:id/status
  test('POST /accounts/:id/status - update status', async () => {
    const res = await request(app)
      .post('/accounts/1/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Target' });

    expect(res.statusCode).toBe(200);
    expect(res.body.account.status).toBe('Target');
  });

  test('POST /accounts/:id/status - invalid account', async () => {
    const res = await request(app)
      .post('/accounts/999/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Target' });

    expect(res.statusCode).toBe(404);
  });
});

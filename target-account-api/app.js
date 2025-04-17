const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const SECRET_KEY = 'your_jwt_secret';

// Dummy Data
const users = [{ username: 'user1', password: 'pass123' }];
let accounts = [
  { id: 1, companyName: 'TechCorp', matchScore: 86, status: 'Not Target' },
  { id: 2, companyName: 'InnovateX', matchScore: 72, status: 'Target' },
];

// Middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Routes
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

app.get('/accounts', authenticate, (req, res) => {
  res.json(accounts);
});

app.post('/accounts/:id/status', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  const account = accounts.find(a => a.id === id);
  if (!account) return res.status(404).json({ message: 'Account not found' });

  account.status = status;
  res.json({ message: 'Status updated', account });
});

module.exports = app;

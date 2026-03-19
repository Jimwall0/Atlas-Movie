import express from 'express';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

// Redirect user to GitHub OAuth
app.get('/auth/login', (req, res) => {
  const redirectUri = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user:email`;
  res.redirect(redirectUri);
});

// Callback from GitHub OAuth
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send('No code');

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      { client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;
    res.cookie('token', accessToken, { httpOnly: true });
    res.redirect('http://localhost:5173'); // frontend
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get logged-in user info
app.get('/api/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Not logged in');

  try {
    const user = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` }
    });

    // Get public email (or fallback to login)
    const email = user.data.email || user.data.login;

    res.json({ login: user.data.login, email });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Logout
app.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

app.listen(4000, () => console.log('Backend running on http://localhost:4000'));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const {
  initDatabase,
  createUser,
  getUserByEmail,
  getUserById,
  updateKindleEmail,
  createArticle,
  getArticlesByUser,
  getArticleById,
  updateArticle,
  deleteArticle
} = require('./database');
const { parseArticle } = require('./parser');
const kindleService = require('./kindle');
const { authenticateToken, generateToken, verifyPassword } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize database
initDatabase();

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, kindleEmail } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const result = createUser(username, email, password, kindleEmail);
    const user = getUserById(result.lastInsertRowid);
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        kindleEmail: user.kindle_email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await verifyPassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        kindleEmail: user.kindle_email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// User routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const user = getUserById(req.user.id);
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      kindleEmail: user.kindle_email
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/user/kindle-email', authenticateToken, (req, res) => {
  try {
    const { kindleEmail } = req.body;
    updateKindleEmail(req.user.id, kindleEmail);
    res.json({ success: true, kindleEmail });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Kindle email' });
  }
});

// Article routes
app.post('/api/articles', authenticateToken, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Parse the article
    const articleData = await parseArticle(url);

    // Save to database
    const result = createArticle(req.user.id, articleData);
    const article = getArticleById(result.lastInsertRowid, req.user.id);

    res.status(201).json(article);
  } catch (error) {
    console.error('Article creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to save article' });
  }
});

app.get('/api/articles', authenticateToken, (req, res) => {
  try {
    const options = {
      read: req.query.read !== undefined ? req.query.read === 'true' : undefined,
      archived: req.query.archived !== undefined ? req.query.archived === 'true' : undefined,
      favorite: req.query.favorite !== undefined ? req.query.favorite === 'true' : undefined,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined
    };

    const articles = getArticlesByUser(req.user.id, options);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.get('/api/articles/:id', authenticateToken, (req, res) => {
  try {
    const article = getArticleById(req.params.id, req.user.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

app.patch('/api/articles/:id', authenticateToken, (req, res) => {
  try {
    const updates = {};
    if (req.body.read !== undefined) updates.read = req.body.read;
    if (req.body.archived !== undefined) updates.archived = req.body.archived;
    if (req.body.favorite !== undefined) updates.favorite = req.body.favorite;

    updateArticle(req.params.id, req.user.id, updates);
    const article = getArticleById(req.params.id, req.user.id);
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/articles/:id', authenticateToken, (req, res) => {
  try {
    deleteArticle(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Send to Kindle
app.post('/api/articles/:id/send-to-kindle', authenticateToken, async (req, res) => {
  try {
    const article = getArticleById(req.params.id, req.user.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const user = getUserById(req.user.id);
    const kindleEmail = req.body.kindleEmail || user.kindle_email;

    if (!kindleEmail) {
      return res.status(400).json({ error: 'Kindle email not set' });
    }

    await kindleService.sendToKindle(article, kindleEmail);
    res.json({ success: true, message: 'Article sent to Kindle' });
  } catch (error) {
    console.error('Send to Kindle error:', error);
    res.status(500).json({ error: error.message || 'Failed to send to Kindle' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Server also accessible at http://21.0.0.8:${PORT}`);
});

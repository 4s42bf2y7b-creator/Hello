const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const db = new Database('kindle-reader.db');

// Initialize database schema
function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      kindle_email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Articles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      title TEXT,
      author TEXT,
      content TEXT,
      excerpt TEXT,
      site_name TEXT,
      word_count INTEGER,
      read BOOLEAN DEFAULT 0,
      archived BOOLEAN DEFAULT 0,
      favorite BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_articles_user_id ON articles(user_id);
    CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);
  `);

  console.log('Database initialized successfully');
}

// User functions
function createUser(username, email, password, kindleEmail = null) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users (username, email, password, kindle_email) VALUES (?, ?, ?, ?)');
  return stmt.run(username, email, hashedPassword, kindleEmail);
}

function getUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
}

function getUserById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
}

function updateKindleEmail(userId, kindleEmail) {
  const stmt = db.prepare('UPDATE users SET kindle_email = ? WHERE id = ?');
  return stmt.run(kindleEmail, userId);
}

// Article functions
function createArticle(userId, articleData) {
  const stmt = db.prepare(`
    INSERT INTO articles (user_id, url, title, author, content, excerpt, site_name, word_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    userId,
    articleData.url,
    articleData.title,
    articleData.author,
    articleData.content,
    articleData.excerpt,
    articleData.siteName,
    articleData.wordCount
  );
}

function getArticlesByUser(userId, options = {}) {
  let query = 'SELECT * FROM articles WHERE user_id = ?';
  const params = [userId];

  if (options.read !== undefined) {
    query += ' AND read = ?';
    params.push(options.read ? 1 : 0);
  }

  if (options.archived !== undefined) {
    query += ' AND archived = ?';
    params.push(options.archived ? 1 : 0);
  }

  if (options.favorite !== undefined) {
    query += ' AND favorite = ?';
    params.push(options.favorite ? 1 : 0);
  }

  query += ' ORDER BY created_at DESC';

  if (options.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
  }

  const stmt = db.prepare(query);
  return stmt.all(...params);
}

function getArticleById(id, userId) {
  const stmt = db.prepare('SELECT * FROM articles WHERE id = ? AND user_id = ?');
  return stmt.get(id, userId);
}

function updateArticle(id, userId, updates) {
  const fields = [];
  const values = [];

  if (updates.read !== undefined) {
    fields.push('read = ?');
    values.push(updates.read ? 1 : 0);
  }

  if (updates.archived !== undefined) {
    fields.push('archived = ?');
    values.push(updates.archived ? 1 : 0);
  }

  if (updates.favorite !== undefined) {
    fields.push('favorite = ?');
    values.push(updates.favorite ? 1 : 0);
  }

  if (fields.length === 0) return null;

  values.push(id, userId);
  const stmt = db.prepare(`UPDATE articles SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`);
  return stmt.run(...values);
}

function deleteArticle(id, userId) {
  const stmt = db.prepare('DELETE FROM articles WHERE id = ? AND user_id = ?');
  return stmt.run(id, userId);
}

module.exports = {
  db,
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
};

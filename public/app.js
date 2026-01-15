const API_BASE = '/api';
let currentArticleId = null;
let currentFilter = 'all';

// Authentication
function showLogin() {
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('auth-error').style.display = 'none';
}

function showRegister() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
  document.getElementById('auth-error').style.display = 'none';
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.error);
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    showApp();
  } catch (error) {
    showError('Login failed. Please try again.');
  }
}

async function register() {
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const kindleEmail = document.getElementById('register-kindle').value;

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, kindleEmail })
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.error);
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    showApp();
  } catch (error) {
    showError('Registration failed. Please try again.');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  location.reload();
}

function showError(message) {
  const errorDiv = document.getElementById('auth-error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function showApp() {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('app-container').style.display = 'grid';
  loadArticles('all');
}

// API Helper
async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  });

  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error('Unauthorized');
  }

  return response;
}

// Articles
async function loadArticles(filter) {
  currentFilter = filter;

  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.filter === filter) {
      item.classList.add('active');
    }
  });

  const params = new URLSearchParams();

  if (filter === 'unread') {
    params.append('read', 'false');
  } else if (filter === 'favorites') {
    params.append('favorite', 'true');
  } else if (filter === 'archived') {
    params.append('archived', 'true');
  }

  try {
    const response = await apiRequest(`/articles?${params}`);
    const articles = await response.json();
    displayArticles(articles);
    updateCounts(articles);
  } catch (error) {
    console.error('Failed to load articles:', error);
  }
}

function displayArticles(articles) {
  const container = document.getElementById('articles-container');

  if (articles.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No articles yet</h2>
        <p>Start by adding your first article!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = articles.map(article => `
    <div class="article-card" onclick="openArticle(${article.id})">
      <h3>${escapeHtml(article.title)}</h3>
      <div class="article-meta">
        ${article.site_name ? `<span>${escapeHtml(article.site_name)}</span>` : ''}
        ${article.word_count ? `<span>${article.word_count} words</span>` : ''}
        <span>${formatDate(article.created_at)}</span>
        ${article.read ? '<span class="badge badge-read">Read</span>' : ''}
        ${article.favorite ? '<span class="badge badge-favorite">★</span>' : ''}
        ${article.archived ? '<span class="badge badge-archived">Archived</span>' : ''}
      </div>
      <div class="article-excerpt">${escapeHtml(article.excerpt || '')}</div>
      <div class="article-actions" onclick="event.stopPropagation()">
        <button onclick="sendToKindle(${article.id})" class="btn-secondary">Send to Kindle</button>
        <button onclick="deleteArticleConfirm(${article.id})" class="btn-secondary">Delete</button>
      </div>
    </div>
  `).join('');
}

async function updateCounts(currentArticles = null) {
  try {
    const response = await apiRequest('/articles');
    const allArticles = await response.json();

    document.getElementById('count-all').textContent = allArticles.length;
    document.getElementById('count-unread').textContent = allArticles.filter(a => !a.read).length;
    document.getElementById('count-favorites').textContent = allArticles.filter(a => a.favorite).length;
    document.getElementById('count-archived').textContent = allArticles.filter(a => a.archived).length;
  } catch (error) {
    console.error('Failed to update counts:', error);
  }
}

async function openArticle(id) {
  try {
    const response = await apiRequest(`/articles/${id}`);
    const article = await response.json();

    currentArticleId = id;

    document.getElementById('article-list-view').style.display = 'none';
    document.getElementById('article-reader-view').style.display = 'block';

    const content = document.getElementById('article-content');
    content.innerHTML = `
      <h1>${escapeHtml(article.title)}</h1>
      <div class="article-meta">
        ${article.author ? `<span>By ${escapeHtml(article.author)}</span>` : ''}
        ${article.site_name ? `<span>${escapeHtml(article.site_name)}</span>` : ''}
        ${article.word_count ? `<span>${article.word_count} words</span>` : ''}
      </div>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid var(--border-color);">
      ${article.content}
    `;

    // Update button states
    document.getElementById('btn-favorite').textContent = article.favorite ? '★' : '☆';
    document.getElementById('btn-read').textContent = article.read ? '✓ Read' : 'Mark as Read';

    // Mark as read if unread
    if (!article.read) {
      await apiRequest(`/articles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ read: true })
      });
    }
  } catch (error) {
    console.error('Failed to load article:', error);
  }
}

function closeReader() {
  document.getElementById('article-list-view').style.display = 'block';
  document.getElementById('article-reader-view').style.display = 'none';
  currentArticleId = null;
  loadArticles(currentFilter);
}

async function toggleFavorite() {
  if (!currentArticleId) return;

  try {
    const response = await apiRequest(`/articles/${currentArticleId}`);
    const article = await response.json();

    await apiRequest(`/articles/${currentArticleId}`, {
      method: 'PATCH',
      body: JSON.stringify({ favorite: !article.favorite })
    });

    document.getElementById('btn-favorite').textContent = !article.favorite ? '★' : '☆';
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
}

async function toggleRead() {
  if (!currentArticleId) return;

  try {
    const response = await apiRequest(`/articles/${currentArticleId}`);
    const article = await response.json();

    await apiRequest(`/articles/${currentArticleId}`, {
      method: 'PATCH',
      body: JSON.stringify({ read: !article.read })
    });

    document.getElementById('btn-read').textContent = !article.read ? '✓ Read' : 'Mark as Read';
  } catch (error) {
    console.error('Failed to toggle read:', error);
  }
}

async function archiveArticle() {
  if (!currentArticleId) return;

  try {
    await apiRequest(`/articles/${currentArticleId}`, {
      method: 'PATCH',
      body: JSON.stringify({ archived: true })
    });

    closeReader();
  } catch (error) {
    console.error('Failed to archive article:', error);
  }
}

// Add Article
function showAddArticle() {
  document.getElementById('add-article-modal').style.display = 'flex';
  document.getElementById('article-url').value = '';
  document.getElementById('save-status').style.display = 'none';
}

function closeAddArticle() {
  document.getElementById('add-article-modal').style.display = 'none';
}

async function saveArticle() {
  const url = document.getElementById('article-url').value;
  const statusDiv = document.getElementById('save-status');

  if (!url) {
    statusDiv.textContent = 'Please enter a URL';
    statusDiv.className = 'status-message status-error';
    statusDiv.style.display = 'block';
    return;
  }

  statusDiv.textContent = 'Saving article...';
  statusDiv.className = 'status-message';
  statusDiv.style.display = 'block';

  try {
    const response = await apiRequest('/articles', {
      method: 'POST',
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    statusDiv.textContent = 'Article saved successfully!';
    statusDiv.className = 'status-message status-success';

    setTimeout(() => {
      closeAddArticle();
      loadArticles(currentFilter);
    }, 1000);
  } catch (error) {
    statusDiv.textContent = error.message || 'Failed to save article';
    statusDiv.className = 'status-message status-error';
  }
}

// Send to Kindle
async function sendToKindle(articleId) {
  if (!confirm('Send this article to your Kindle?')) return;

  try {
    const response = await apiRequest(`/articles/${articleId}/send-to-kindle`, {
      method: 'POST'
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    alert('Article sent to Kindle!');
  } catch (error) {
    alert(error.message || 'Failed to send to Kindle. Please check your settings.');
  }
}

async function sendCurrentToKindle() {
  if (currentArticleId) {
    await sendToKindle(currentArticleId);
  }
}

// Delete Article
async function deleteArticleConfirm(articleId) {
  if (!confirm('Delete this article?')) return;

  try {
    await apiRequest(`/articles/${articleId}`, {
      method: 'DELETE'
    });

    loadArticles(currentFilter);
  } catch (error) {
    alert('Failed to delete article');
  }
}

// Settings
function showSettings() {
  const user = JSON.parse(localStorage.getItem('user'));
  document.getElementById('settings-kindle-email').value = user.kindleEmail || '';
  document.getElementById('settings-modal').style.display = 'flex';
}

function closeSettings() {
  document.getElementById('settings-modal').style.display = 'none';
}

async function saveSettings() {
  const kindleEmail = document.getElementById('settings-kindle-email').value;

  try {
    await apiRequest('/user/kindle-email', {
      method: 'PUT',
      body: JSON.stringify({ kindleEmail })
    });

    const user = JSON.parse(localStorage.getItem('user'));
    user.kindleEmail = kindleEmail;
    localStorage.setItem('user', JSON.stringify(user));

    alert('Settings saved successfully!');
    closeSettings();
  } catch (error) {
    alert('Failed to save settings');
  }
}

// Utilities
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
}

// Check URL parameters for bookmarklet
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleUrl = urlParams.get('url');

  if (articleUrl && localStorage.getItem('token')) {
    showApp();
    showAddArticle();
    document.getElementById('article-url').value = articleUrl;
  } else if (localStorage.getItem('token')) {
    showApp();
  }
});

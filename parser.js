const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

async function parseArticle(url) {
  try {
    // Fetch the webpage
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    // Parse HTML with JSDOM
    const dom = new JSDOM(response.data, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error('Could not parse article content');
    }

    // Calculate word count
    const textContent = article.textContent || '';
    const wordCount = textContent.trim().split(/\s+/).length;

    // Create excerpt (first 200 characters)
    const excerpt = textContent.substring(0, 200).trim() + (textContent.length > 200 ? '...' : '');

    return {
      url,
      title: article.title || 'Untitled',
      author: article.byline || null,
      content: article.content,
      excerpt,
      siteName: article.siteName || extractDomain(url),
      wordCount
    };
  } catch (error) {
    console.error('Error parsing article:', error.message);
    throw new Error(`Failed to parse article: ${error.message}`);
  }
}

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Unknown';
  }
}

module.exports = { parseArticle };

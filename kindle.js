const nodemailer = require('nodemailer');

class KindleService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendToKindle(article, kindleEmail) {
    try {
      // Format content as HTML for better Kindle rendering
      const htmlContent = this.formatForKindle(article);

      // Send email with article as attachment
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: kindleEmail,
        subject: article.title,
        html: htmlContent,
        attachments: [
          {
            filename: `${this.sanitizeFilename(article.title)}.html`,
            content: htmlContent,
            contentType: 'text/html'
          }
        ]
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent to Kindle:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending to Kindle:', error);
      throw new Error(`Failed to send to Kindle: ${error.message}`);
    }
  }

  formatForKindle(article) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${this.escapeHtml(article.title)}</title>
  <style>
    body {
      font-family: Georgia, serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      font-size: 1.8em;
      margin-bottom: 10px;
    }
    .meta {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 20px;
    }
    .content {
      font-size: 1em;
    }
    .content img {
      max-width: 100%;
      height: auto;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ccc;
      font-size: 0.8em;
      color: #999;
    }
  </style>
</head>
<body>
  <h1>${this.escapeHtml(article.title)}</h1>
  <div class="meta">
    ${article.author ? `<p>By ${this.escapeHtml(article.author)}</p>` : ''}
    ${article.siteName ? `<p>Source: ${this.escapeHtml(article.siteName)}</p>` : ''}
    ${article.wordCount ? `<p>${article.wordCount} words</p>` : ''}
  </div>
  <div class="content">
    ${article.content}
  </div>
  <div class="footer">
    <p>Original URL: <a href="${this.escapeHtml(article.url)}">${this.escapeHtml(article.url)}</a></p>
    <p>Sent from Kindle Reader App</p>
  </div>
</body>
</html>
    `.trim();
  }

  escapeHtml(text) {
    if (!text) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  sanitizeFilename(filename) {
    return filename
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_+/g, '_')
      .substring(0, 100);
  }
}

module.exports = new KindleService();

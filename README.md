# Kindle Reader - Free Read-It-Later App

A free, self-hosted alternative to Instapaper with Send to Kindle functionality. Save articles from the web, read them in a clean interface, and send them directly to your Kindle device.

## Features

- **Article Saving**: Save articles from any URL with automatic content extraction
- **Clean Reading**: Distraction-free reading experience with parsed, clean content
- **Send to Kindle**: Email articles directly to your Kindle device
- **Article Management**: Mark as read, favorite, archive, and delete articles
- **User Authentication**: Secure user accounts with JWT authentication
- **Bookmarklet**: Quick save button for your browser bookmarks bar
- **Responsive Design**: Works on desktop and mobile devices
- **Free & Self-Hosted**: No subscription fees, full control of your data

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- SMTP email account (Gmail recommended for Send to Kindle)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Hello
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   PORT=3000
   JWT_SECRET=your-random-secret-key-change-this-to-something-secure

   # Gmail SMTP Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the app**
   Open your browser and go to `http://localhost:3000`

## Email Setup for Send to Kindle

### Step 1: Set up Gmail App Password

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled
4. Search for "App passwords" and create a new app password
5. Use this app password in your `.env` file as `EMAIL_PASS`

### Step 2: Configure Kindle Email

1. Go to [Amazon Personal Document Settings](https://www.amazon.com/hz/mycd/myx#/home/settings/payment)
2. Find your Kindle email address (e.g., username@kindle.com)
3. Add your Gmail address to "Approved Personal Document E-mail List"
4. Save your Kindle email in the app settings

## Usage Guide

### Saving Articles

**Method 1: Manual Entry**
1. Click "Add Article" button
2. Paste the article URL
3. Click "Save Article"

**Method 2: Bookmarklet**
1. Go to Settings in the app
2. Drag the "Save to Kindle Reader" button to your bookmarks bar
3. When browsing an article, click the bookmarklet to save it

### Reading Articles

- Click on any article in the list to open the reader view
- Articles are automatically marked as read when opened
- Use the toolbar to favorite, archive, or send to Kindle

### Sending to Kindle

1. Click "Send to Kindle" button on any article
2. Article will be emailed to your configured Kindle email
3. Article appears on your Kindle device within minutes

### Organizing Articles

- **Unread**: View articles you haven't read yet
- **Favorites**: Star important articles
- **Archived**: Archive articles you've finished
- **All Articles**: View everything

## API Documentation

### Authentication Endpoints

**Register**
```
POST /api/auth/register
Body: { username, email, password, kindleEmail? }
```

**Login**
```
POST /api/auth/login
Body: { email, password }
Returns: { token, user }
```

### Article Endpoints

**Save Article**
```
POST /api/articles
Headers: Authorization: Bearer <token>
Body: { url }
```

**Get Articles**
```
GET /api/articles?read=false&favorite=true&archived=false
Headers: Authorization: Bearer <token>
```

**Get Single Article**
```
GET /api/articles/:id
Headers: Authorization: Bearer <token>
```

**Update Article**
```
PATCH /api/articles/:id
Headers: Authorization: Bearer <token>
Body: { read?, favorite?, archived? }
```

**Delete Article**
```
DELETE /api/articles/:id
Headers: Authorization: Bearer <token>
```

**Send to Kindle**
```
POST /api/articles/:id/send-to-kindle
Headers: Authorization: Bearer <token>
Body: { kindleEmail? }
```

### User Endpoints

**Get Profile**
```
GET /api/user/profile
Headers: Authorization: Bearer <token>
```

**Update Kindle Email**
```
PUT /api/user/kindle-email
Headers: Authorization: Bearer <token>
Body: { kindleEmail }
```

## Project Structure

```
Hello/
├── server.js           # Express server and API routes
├── database.js         # SQLite database setup and queries
├── parser.js           # Article content extraction
├── kindle.js           # Email service for Kindle delivery
├── auth.js             # JWT authentication middleware
├── package.json        # Dependencies and scripts
├── .env                # Environment configuration (create from .env.example)
├── public/             # Frontend files
│   ├── index.html      # Main HTML page
│   ├── style.css       # Styling
│   └── app.js          # Frontend JavaScript
└── README.md           # This file
```

## Technology Stack

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- JWT authentication
- Nodemailer for email

**Article Parsing:**
- @mozilla/readability
- JSDOM
- Axios

**Frontend:**
- Vanilla JavaScript
- Modern CSS (Grid, Flexbox)
- Responsive design

## Troubleshooting

### Articles not parsing correctly
- Some websites block scrapers or require authentication
- Try accessing the article directly in a browser first
- Check console logs for specific errors

### Send to Kindle not working
- Verify your Gmail app password is correct
- Ensure your email is added to Amazon's approved senders list
- Check that your Kindle email address is correct
- Look for emails in Gmail's "Sent" folder to confirm sending

### Database errors
- Delete `kindle-reader.db` file and restart to reset database
- Check file permissions in the project directory

## Security Notes

- Change `JWT_SECRET` to a strong, random value
- Keep your `.env` file secure and never commit it to git
- Use HTTPS in production (consider using a reverse proxy like nginx)
- Regularly update dependencies for security patches

## Development

**Run in development mode with auto-reload:**
```bash
npm run dev
```

**Database location:**
SQLite database is stored as `kindle-reader.db` in the project root.

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Comparison to Instapaper

| Feature | Kindle Reader (This App) | Instapaper |
|---------|-------------------------|------------|
| Price | Free, self-hosted | $3/month premium |
| Send to Kindle | ✅ Yes | ✅ Yes (Premium) |
| Article saving | ✅ Yes | ✅ Yes |
| Clean reader | ✅ Yes | ✅ Yes |
| Mobile apps | Web-based | iOS, Android |
| Data ownership | You own it | Stored on their servers |
| Customization | Fully customizable | Limited |

## Future Enhancements

- [ ] Full-text search
- [ ] Tags and folders
- [ ] Mobile apps (React Native)
- [ ] Browser extensions (Chrome, Firefox)
- [ ] Export to other formats (EPUB, PDF)
- [ ] Highlighting and notes
- [ ] Text-to-speech
- [ ] Reading statistics
- [ ] Social sharing
- [ ] RSS feed support

## Support

For issues and questions, please open a GitHub issue.

---

Made with ❤️ for readers who want to own their data

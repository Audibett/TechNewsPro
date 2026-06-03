# TechNews Pro - Professional Tech News Platform

A full-stack web application built with Node.js, Express, React, and MongoDB.

## Features

✨ **Frontend (React)**
- Modern, responsive UI with dark mode support
- Dynamic article listings with pagination
- Article search and category filtering
- User authentication
- User profiles with article management
- Comments system with nested replies
- Like/favorite functionality
- Newsletter subscription
- Professional gradient designs and animations

🔧 **Backend (Node.js/Express)**
- RESTful API with full CRUD operations
- User authentication with JWT
- Article management system
- Comment system with nested replies
- Category management
- MongoDB integration
- Password hashing with bcryptjs
- Request validation and error handling

📱 **Key Features**
- ✅ Fully dynamic and responsive
- ✅ User authentication & authorization
- ✅ Article CRUD operations
- ✅ Comment system
- ✅ Search & filtering
- ✅ Like/favorite articles
- ✅ User profiles
- ✅ Dark mode
- ✅ Mobile-friendly
- ✅ Professional UI/UX

## Tech Stack

- **Frontend:** React 18, React Router v6, Axios, React Icons
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs for password hashing, CORS

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Clone & Setup

```bash
cd WebsiteMy

# Install root dependencies
npm install

# Install backend dependencies (if separate)
cd server && npm install && cd ..

# Install frontend dependencies (if separate)
cd client && npm install && cd ..
```

## Configuration

1. Create `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/tech-news
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

2. For cloud MongoDB (Atlas), replace `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tech-news
```

## Running the Application

### Option 1: Development Mode (Concurrent)

```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend (port 3000) concurrently.

### Option 2: Separate Terminals

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### Option 3: Production Build

```bash
npm run build
npm start
```

## URLs

- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000/api

## API Endpoints

### Articles
- `GET /api/articles` - Get all articles (with pagination)
- `GET /api/articles/featured` - Get featured articles
- `GET /api/articles/:slug` - Get single article
- `POST /api/articles` - Create article (authenticated)
- `PUT /api/articles/:id` - Update article (authenticated)
- `POST /api/articles/:id/like` - Like article (authenticated)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (authenticated)
- `GET /api/users/:id` - Get user profile
- `POST /api/users/:id/follow` - Follow user (authenticated)

### Comments
- `GET /api/comments/article/:articleId` - Get comments for article
- `POST /api/comments` - Create comment (authenticated)
- `POST /api/comments/:id/like` - Like comment (authenticated)
- `DELETE /api/comments/:id` - Delete comment (authenticated)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category with articles

## Project Structure

```
WebsiteMy/
├── server/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── index.js         # Server entry point
│   └── package.json
├── client/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   ├── styles/      # CSS files
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Default Categories

The application comes with pre-configured categories:
- **AI** - Artificial Intelligence & Machine Learning
- **Web** - Web Development & Design
- **Mobile** - Mobile App Development
- **Security** - Cybersecurity & Privacy
- **Startups** - Startup News & Funding

## Features Explanation

### Dynamic Content
- Articles are loaded dynamically from the backend
- Real-time search functionality
- Pagination for better performance
- Category filtering

### User System
- User registration and login
- JWT authentication for secure API access
- User profiles with articles and followers
- Follow/unfollow functionality

### Comments & Interactions
- Comment on articles
- Nested replies (infrastructure ready)
- Like comments and articles
- User avatars and biographical info

### Responsive Design
- Mobile-first approach
- Dark mode support (toggle in header)
- Gradient graphics and modern UI
- Smooth animations and transitions

### Professional UI
- Consistent color scheme with gradients
- Modern card designs
- Smooth hover effects
- Professional typography
- Accessibility considerations

## Future Enhancements

- [ ] Advanced search with filters
- [ ] Article drafts and scheduling
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Admin dashboard
- [ ] Analytics and metrics
- [ ] Reading time estimation
- [ ] Article rating system
- [ ] Bookmark articles
- [ ] Trending algorithms

## Troubleshooting

### MongoDB Connection Issue
- Ensure MongoDB is running locally: `mongod`
- Or update `MONGODB_URI` in `.env` to your MongoDB Atlas connection string

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

### Module Not Found
- Delete `node_modules` and `.package-lock.json`
- Run `npm install` again

## License

MIT License - Feel free to use and modify

## Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ as a professional tech news platform**

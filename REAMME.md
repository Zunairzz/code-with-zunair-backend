# Express.js MongoDB API + React Vite Frontend

A full-stack application with Express.js MongoDB backend and React Vite frontend, optimized for deployment on Vercel.

## Features

- 🚀 Express.js REST API backend
- ⚛️ React with Vite frontend
- 🗄️ MongoDB with Mongoose ODM
- 📱 CORS configured for React integration
- 🔄 Proxy setup for development
- 🔍 Advanced filtering and search
- 📄 Pagination support
- ✅ Input validation and error handling
- 🌐 Vercel-optimized deployment

## Project Structure

### Backend (API)
```
backend/
├── api/
│   ├── index.js          # Main application file
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   └── Item.js
│   └── routes/           # Express routes
│       ├── users.js
│       └── items.js
├── package.json
├── vercel.json          # Vercel configuration
└── .env.example         # Environment variables template
```

### Frontend (React Vite)
```
frontend/
├── src/
│   ├── components/       # React components
│   │   └── UsersList.jsx # Example component
│   ├── services/         # API service layer
│   │   └── api.js        # API calls
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js       # Vite configuration with proxy
├── package.json
└── .env                 # Vite environment variables
```

## API Endpoints

### Users
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/toggle-active` - Toggle user active status

### Items
- `GET /api/items` - Get all items (with filtering and search)
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `PATCH /api/items/:id/stock` - Update stock status
- `GET /api/items/category/:category` - Get items by category

### Other
- `GET /` - API info and available endpoints
- `GET /api/health` - Health check endpoint

## Quick Start

### 1. Setup Backend (API)
```bash
# In your backend directory
npm install
cp .env .env
# Edit .env with your MongoDB URI
npm run dev
```

### 2. Setup Frontend (React Vite)
```bash
# Create React app with Vite
npx create-vite@latest frontend --template react
cd frontend
npm install

# Copy the provided vite.config.js and api service files
# Edit .env with your API URL
npm run dev
```

### 3. Development Workflow
- Backend runs on `http://localhost:3000`
- Frontend runs on `http://localhost:5173`
- Vite proxy forwards `/api/*` calls to backend
- Both can run simultaneously for full-stack development

### 4. Deploy to Vercel

#### Backend Deployment
```bash
# In backend directory
vercel
# Add MONGODB_URI in Vercel dashboard
```

#### Frontend Deployment
```bash
# In frontend directory
npm run build
vercel
# Set VITE_API_BASE_URL to your backend URL
```

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-api-domain.vercel.app
VITE_API_BASE_URL_DEV=http://localhost:3000
VITE_APP_NAME=My React App
```

## API Usage Examples

### Create a User
```bash
curl -X POST https://your-app.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'
```

### Create an Item
```bash
curl -X POST https://your-app.vercel.app/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laptop",
    "description": "Gaming laptop",
    "price": 999.99,
    "category": "electronics",
    "quantity": 5,
    "createdBy": "USER_ID_HERE"
  }'
```

### Search Items
```bash
curl "https://your-app.vercel.app/api/items?search=laptop&category=electronics&minPrice=500"
```

## MongoDB Setup

### Using MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `MONGODB_URI` environment variable

### Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/myapp
```

## Features Included

### Advanced Filtering
- Filter by category, price range, stock status
- Text search across title and description
- Pagination with customizable page size

### Data Validation
- Required field validation
- Email format validation
- Price and age constraints
- Enum validation for categories

### Error Handling
- Comprehensive error responses
- Validation error messages
- 404 handling for missing resources

### Performance Optimizations
- Database indexes for faster queries
- Population of related data
- Efficient pagination

## Troubleshooting

### Common Issues

**Vercel Build Fails**
- Ensure `vercel.json` is properly configured
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility

**MongoDB Connection Issues**
- Verify `MONGODB_URI` is correct
- Check network access in MongoDB Atlas
- Ensure database user has proper permissions

**API Not Working**
- Check Vercel function logs
- Verify environment variables are set
- Test endpoints locally first

## Development

### Adding New Features
1. Create new model in `api/models/`
2. Add routes in `api/routes/`
3. Import routes in `api/index.js`
4. Test locally before deploying

### Database Design
- Use Mongoose schemas with validation
- Add indexes for frequently queried fields
- Use population for related data

This structure is optimized for Vercel's serverless functions and provides a solid foundation for building scalable REST APIs.
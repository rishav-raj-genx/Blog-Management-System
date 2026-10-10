# Blog Management System

## Project Description
A full-stack (MERN) monorepo application for managing blog posts. It features user authentication, role-based access control (Admin/User), and full CRUD operations for posts. Users can create, read, update, and delete their own posts, while Admins have global access to manage all posts.

## Features
- User Authentication (Register/Login) with JWT.
- Role-based Access Control (Admin vs. User).
- Full CRUD operations for Blog Posts.
- Global Error Handling UI.
- Responsive Design.

## Tech Stack
- **Frontend:** React.js, Vite, React Router, Axios
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose
- **Deployment Targets:** Vercel (Frontend), Render/Railway (Backend)

## Team Members
**Team 15**
- **TL:** Rishav Raj - 67
- **Members:** Rewas Khatri , Sagar Kumar , Divyansh Gupta

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd blog-management-system
   ```

2. **Install dependencies:**
   - For backend:
     ```bash
     cd backend
     pnpm install
     ```
   - For frontend:
     ```bash
     cd frontend
     pnpm install
     ```

3. **Configure Environment Variables:**
   Create `.env` files in both `frontend` and `backend` directories using the `.env.example` templates.

4. **Run the Development Servers:**
   - Start backend (from `backend` folder): `pnpm dev`
   - Start frontend (from `frontend` folder): `pnpm dev`

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection
JWT_SECRET=your_secret
```

The backend will refuse to start when `MONGO_URI` or `JWT_SECRET` is missing.
Copy `backend/.env.example` to `backend/.env` and set both values before
running the API.

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

| Method | Endpoint                 | Description                     | Access   |
|--------|--------------------------|---------------------------------|----------|
| POST   | `/api/auth/register`     | Register a new user             | Public   |
| POST   | `/api/auth/login`        | Authenticate a user             | Public   |
| POST   | `/api/posts`             | Create a new blog post          | User     |
| GET    | `/api/posts`             | Get all blog posts              | Public   |
| GET    | `/api/posts/:id`         | Get a single blog post by ID    | Public   |
| PUT    | `/api/posts/:id`         | Update an existing post         | Owner/Admin |
| DELETE | `/api/posts/:id`         | Delete a post                   | Owner/Admin |
| GET    | `/api/users/profile`     | Get current user profile        | User     |
| GET    | `/api/admin/posts`       | Get all posts for admin panel   | Admin    |
| DELETE | `/api/admin/posts/:id`   | Delete any post (Admin)         | Admin    |

## Screenshots
*(Add placeholders/screenshots here)*

## Deployment Links
- **Frontend (Vercel):** *[Link Pending]*
- **Backend (Render/Railway):** *[Link Pending]*

## Project Documentation

- [Contributing Guide](./CONTRIBUTING.md)
- [Project Rules](./RULES.md)
- [AI Usage Policy](./AI_USAGE.md)

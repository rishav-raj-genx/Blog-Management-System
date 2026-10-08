#!/bin/bash

# Ensure gh cli is installed
if ! command -v gh &> /dev/null
then
    echo "GitHub CLI (gh) could not be found. Please install it or create the issues manually."
    exit
fi

echo "Creating Issue 1: Backend Auth & User Model"
gh issue create \
  --title "feat: Implement User Authentication API" \
  --body "Create the User Mongoose model (name, email, password, role: Admin/User). Implement POST /api/auth/register and POST /api/auth/login. Implement the JWT generation and the authenticateUser and requireAdmin middleware.

**Branch format:** \`feature/auth\`"

echo "Creating Issue 2: Backend Post CRUD API"
gh issue create \
  --title "feat: Implement Post CRUD Endpoints" \
  --body "Create the Post Mongoose model (title, content, category, author, tags, createdAt). Implement POST /api/posts, GET /api/posts, GET /api/posts/:id, PUT /api/posts/:id, and DELETE /api/posts/:id. Ensure Users can only edit/delete their own posts, while Admins can edit/delete all posts.

**Branch format:** \`feature/backend-crud\`"

echo "Creating Issue 3: Frontend Routing & Auth Pages"
gh issue create \
  --title "feat: Setup React Router & Auth UI" \
  --body "Configure React Router in App.jsx. Build the Login and Register page components. Create a services/auth.js file to handle the axios calls to the backend auth endpoints. Store the JWT token in localStorage.

**Branch format:** \`feature/frontend-auth\`"

echo "Creating Issue 4: Frontend Blog Feed (Read)"
gh issue create \
  --title "feat: Build Home Page Feed & Post Details" \
  --body "Build the Home page to GET /api/posts and display all blog posts in a grid/list. Use useEffect to fetch the data. Build a 'Post Detail' page that shows the full content of a single post when clicked.

**Branch format:** \`feature/frontend-feed\`"

echo "Creating Issue 5: Frontend Post Creation & Editing"
gh issue create \
  --title "feat: Build Create/Edit Post Forms" \
  --body "Build a protected route for creating a new post. Use controlled inputs (useState) for title, content, category, and tags. Build the 'Edit Post' page that pre-fills the form with existing data and sends a PUT request.

**Branch format:** \`feature/frontend-forms\`"

echo "Creating Issue 6: Frontend Admin Dashboard & Error Handling"
gh issue create \
  --title "feat: Implement Admin View & Error UI" \
  --body "Build a dashboard visible only to Admins that lists all posts with quick 'Delete' buttons. Implement global error handling UI (e.g., toast notifications or alert banners if an API call fails).

**Branch format:** \`feature/dashboard\`"

echo "All issues have been successfully created!"

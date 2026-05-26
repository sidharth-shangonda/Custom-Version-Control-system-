# GitHub Clone with Custom Version Control

A MERN stack GitHub-style application with a custom version control layer built from scratch. The project combines a React frontend, an Express and MongoDB backend, repository and issue APIs, user authentication, and a CLI that stores commits locally before syncing them to AWS S3.

## Project Overview

This repository is split into two main applications:

- `frontend-main`: A Vite and React client that provides authentication, dashboard, repository search, suggested repositories, and profile pages.
- `backend-main`: An Express server that exposes user, repository, and issue APIs, connects to MongoDB, and includes custom version control commands.

The custom version control system creates a hidden `.apnaGit` directory inside the working folder where commands are run. Files can be staged, committed into UUID-based commit folders, pushed to S3, pulled back from S3, and restored by commit ID.

## Features

- User signup and login with hashed passwords and JWT tokens.
- Dashboard for viewing the current user's repositories.
- Suggested repository list from all repositories in the database.
- Profile page with user details, activity heat map, and logout flow.
- Repository CRUD APIs with owner and issue population.
- Issue CRUD APIs with open and closed status support.
- Custom CLI commands for `init`, `add`, `commit`, `push`, `pull`, and `revert`.
- MongoDB persistence through Mongoose models and the MongoDB driver.
- S3-backed storage for custom commit objects.

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- Primer React and Primer CSS
- Vitest and Testing Library dependencies

### Backend

- Node.js
- Express
- MongoDB and Mongoose
- JWT authentication
- bcrypt password hashing
- AWS SDK for S3 sync
- yargs for CLI commands
- Socket.IO server setup

## Folder Structure

```text
.
|-- backend-main
|   |-- config
|   |   `-- aws-config.js
|   |-- controllers
|   |   |-- add.js
|   |   |-- commit.js
|   |   |-- init.js
|   |   |-- issueController.js
|   |   |-- pull.js
|   |   |-- push.js
|   |   |-- repoController.js
|   |   |-- revert.js
|   |   `-- userController.js
|   |-- models
|   |   |-- issueModel.js
|   |   |-- repoModel.js
|   |   `-- userModel.js
|   |-- routes
|   |   |-- issue.router.js
|   |   |-- main.router.js
|   |   |-- repo.router.js
|   |   `-- user.router.js
|   |-- index.js
|   `-- package.json
|-- frontend-main
|   |-- src
|   |   |-- components
|   |   |-- App.jsx
|   |   |-- Routes.jsx
|   |   |-- authContext.jsx
|   |   `-- main.jsx
|   `-- package.json
`-- README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB Atlas or a local MongoDB database
- AWS account and S3 bucket for the custom version control sync commands

## Environment Variables

Create `backend-main/.env` with the backend configuration:

```env
PORT=3002
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
```

The frontend currently calls the backend at `http://localhost:3002`, so use `PORT=3002` for local development unless you also update the frontend API URLs.

For S3-backed custom version control commands, configure AWS credentials in your shell or local AWS profile:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
```

Also update `backend-main/config/aws-config.js` with your S3 bucket name before using `push` or `pull`.

## Installation

Install backend dependencies:

```bash
cd backend-main
npm install
```

Install frontend dependencies:

```bash
cd ../frontend-main
npm install
```

## Running Locally

Start the backend API server:

```bash
cd backend-main
npm start
```

Start the frontend dev server in another terminal:

```bash
cd frontend-main
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Frontend Routes

| Route | Description |
| --- | --- |
| `/auth` | Login page |
| `/signup` | Signup page |
| `/` | Authenticated dashboard |
| `/profile` | User profile page |

## Backend API Routes

### User Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/allUsers` | Fetch all users |
| `POST` | `/signup` | Create a new user |
| `POST` | `/login` | Log in and receive a JWT |
| `GET` | `/userProfile/:id` | Fetch one user profile |
| `PUT` | `/updateProfile/:id` | Update email or password |
| `DELETE` | `/deleteProfile/:id` | Delete a user profile |

### Repository Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/repo/create` | Create a repository |
| `GET` | `/repo/all` | Fetch all repositories |
| `GET` | `/repo/:id` | Fetch repository by ID |
| `GET` | `/repo/name/:name` | Fetch repository by name |
| `GET` | `/repo/user/:userID` | Fetch repositories owned by a user |
| `PUT` | `/repo/update/:id` | Update repository content and description |
| `DELETE` | `/repo/delete/:id` | Delete a repository |
| `PATCH` | `/repo/toggle/:id` | Toggle repository visibility |

### Issue Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/issue/create` | Create an issue |
| `GET` | `/issue/all` | Fetch issues |
| `GET` | `/issue/:id` | Fetch issue by ID |
| `PUT` | `/issue/update/:id` | Update an issue |
| `DELETE` | `/issue/delete/:id` | Delete an issue |

## Custom Version Control CLI

Run these commands from the directory where you want the `.apnaGit` repository to exist.

```bash
node backend-main/index.js init
```

Creates `.apnaGit`, a `commits` directory, and a config file.

```bash
node backend-main/index.js add path/to/file
```

Copies a file into `.apnaGit/staging`.

```bash
node backend-main/index.js commit "your commit message"
```

Creates a UUID commit folder under `.apnaGit/commits` and stores staged files plus commit metadata.

```bash
node backend-main/index.js push
```

Uploads commit folders to the configured S3 bucket.

```bash
node backend-main/index.js pull
```

Downloads commit objects from S3 back into the local `.apnaGit` structure.

```bash
node backend-main/index.js revert commit-id
```

Copies files from a specific commit folder back into the working directory.

## Data Models

### User

Stores username, email, hashed password, repositories, followed users, and starred repositories.

### Repository

Stores name, description, visibility, owner, content entries, and linked issues.

### Issue

Stores title, description, status, and the linked repository.

## Available Scripts

Backend:

```bash
npm start
```

Starts the Express server through the `start` CLI command.

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Development Notes

- The backend default port is `3000`, but the frontend is wired to `3002`. Set `PORT=3002` in `backend-main/.env` for the smoothest local setup.
- Authentication tokens and user IDs are stored in `localStorage` by the frontend.
- Repository and profile views depend on a valid `userId` in `localStorage`.
- The S3 bucket name is currently configured in `backend-main/config/aws-config.js`.
- The CLI custom version control commands operate on the current working directory, not automatically on the project root.

## Troubleshooting

- If the frontend cannot load repositories, confirm the backend is running on `http://localhost:3002`.
- If signup or login fails, verify `MONGODB_URI` and `JWT_SECRET_KEY` are present in `backend-main/.env`.
- If S3 push or pull fails, confirm AWS credentials, region, and bucket name are configured.
- If the dashboard redirects to login, clear `localStorage` and sign in again.

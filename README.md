# Task Manager

This project is purely for learning purposes, to familiarise myself with Nuxt and Vue after a long time.

## Features

- **Authentication** - User registration and login
- **Projects** - Create and manage projects
- **Tasks** - Create and manage tasks within projects
- **Comments with Reactions** - Add comments to tasks and react to them

## Setup

1. Copy the environment example file to create your `.env` file:

```bash
copy .env.example .env
```

2. Configure your environment variables in `.env`:
   - **DATABASE_URL**: Your MongoDB connection string (e.g., `mongodb://localhost:27017/task_manager` or a MongoDB Atlas connection string)
   - **BETTER_AUTH_SECRET**: Generate a secure random secret for authentication. You can generate one using:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - **VITE_BASE_URL**: The base URL for your application (e.g., `http://localhost:3000` for development)

3. Install dependencies:

```bash
npm install
```

4. Generate the Prisma client (required for development):

```bash
npm run db:generate
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

# CropCoachAI Setup Guide

This guide will help you set up and run the CropCoachAI application locally.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **PostgreSQL Database** (you can use Neon, Supabase, or any PostgreSQL database)
- **Gemini API Key** (get one from https://aistudio.google.com/app/apikey)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (same level as `package.json`) with the following variables:

```env
# Database Configuration
# Get your database URL from Neon (https://neon.tech) or use any PostgreSQL database
DATABASE_URL=postgresql://user:password@localhost:5432/cropcoachai

# Session Secret
# Generate a random string for session encryption
# You can use: openssl rand -hex 32
SESSION_SECRET=your-session-secret-here-change-this-in-production

# Gemini AI API Key
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here

# Server Port (optional, defaults to 3000)
PORT=3000
```

### 3. Set Up the Database

Run the database migrations to create the necessary tables:

```bash
npm run db:push
```

This will create all the required tables in your PostgreSQL database.

### 4. Run the Application

#### Development Mode

```bash
npm run dev
```

This will start both the frontend (Vite) and backend (Express) servers in development mode.

#### Production Mode

First, build the application:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## Accessing the Application

Once the server is running, open your browser and navigate to:

- **Development**: http://localhost:3000 (or the port specified in your .env file)
- **Production**: http://localhost:3000 (or the port specified in your .env file)

## Troubleshooting

### Database Connection Issues

- Ensure your `DATABASE_URL` is correct and the database is accessible
- Check that your database server is running
- Verify network connectivity if using a remote database

### Missing Environment Variables

If you see errors about missing environment variables, make sure your `.env` file is in the root directory and contains all required variables.

### Port Already in Use

If port 3000 is already in use, change the `PORT` variable in your `.env` file to a different port number.

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express server
- `shared/` - Shared TypeScript schemas
- `dist/` - Build output (created after running `npm run build`)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run check` - Type check TypeScript files


// Load environment variables first before any other imports
import './env.js';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { registerRoutes } from './routes.js';
import { setupVite, serveStatic, log } from './vite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy (important for sessions behind reverse proxies)
app.set('trust proxy', 1);

// Body parsing middleware (must be before routes)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

async function startServer() {
  try {
    // Register all API routes
    const server = await registerRoutes(app);
    
    // Error handling middleware (must be after routes)
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      log(`Error: ${err.message}`, 'error');
      console.error(err.stack);
      res.status(500).json({ 
        error: isProduction ? 'Internal server error' : err.message,
        ...(isProduction ? {} : { stack: err.stack })
      });
    });
    
    // Setup Vite in development, serve static files in production
    if (isProduction) {
      serveStatic(app);
      log('Serving static files from dist/public', 'server');
    } else {
      await setupVite(app, server);
      log('Vite dev server configured', 'server');
    }

    // Start the server
    server.listen(port, () => {
      log(`Server running on port ${port}`, 'server');
      log(`Environment: ${isProduction ? 'production' : 'development'}`, 'server');
    });
  } catch (error) {
    log(`Failed to start server: ${error}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

startServer();
// Load environment variables before any other imports
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from project root
dotenv.config({ path: join(__dirname, '..', '.env') });

// Export a function to ensure env is loaded
export function ensureEnvLoaded() {
  // Environment variables are now loaded
  return true;
}


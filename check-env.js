// Simple script to check if .env file exists and has required variables
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.join(__dirname, '.env');
const requiredVars = ['DATABASE_URL', 'SESSION_SECRET', 'GEMINI_API_KEY'];

console.log('Checking environment setup...\n');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('\nPlease create a .env file in the root directory with the following variables:');
  console.log('\nDATABASE_URL=postgresql://user:password@localhost:5432/cropcoachai');
  console.log('SESSION_SECRET=your-session-secret-here');
  console.log('GEMINI_API_KEY=your-gemini-api-key-here');
  console.log('PORT=3000\n');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const missing = [];

for (const varName of requiredVars) {
  if (!envContent.includes(`${varName}=`)) {
    missing.push(varName);
  }
}

if (missing.length > 0) {
  console.log('❌ Missing required environment variables:');
  missing.forEach(v => console.log(`   - ${v}`));
  console.log('\nPlease add these variables to your .env file.\n');
  process.exit(1);
}

console.log('✅ .env file found with all required variables!');
console.log('\nYou can now run:');
console.log('  npm run db:push  (to set up the database)');
console.log('  npm run dev      (to start the development server)\n');


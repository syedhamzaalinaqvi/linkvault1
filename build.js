import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building LinkShare for Vercel deployment...');

try {
  // Ensure client dependencies are installed
  console.log('Installing client dependencies...');
  if (!fs.existsSync('client/node_modules')) {
    execSync('cd client && npm install', { stdio: 'inherit' });
  }
  
  // Build the client (frontend)
  console.log('Building frontend...');
  execSync('cd client && npm run build', { stdio: 'inherit' });
  
  // Create dist directory and copy client build
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  
  console.log('Copying build files...');
  fs.mkdirSync('dist', { recursive: true });
  
  if (fs.existsSync('client/dist')) {
    fs.cpSync('client/dist', 'dist', { recursive: true });
    console.log('Build completed successfully!');
    console.log('Files ready for Vercel deployment in /dist directory.');
  } else {
    throw new Error('Client build not found at client/dist');
  }
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building LinkShare for Vercel deployment...');

try {
  // Build the client (frontend)
  console.log('Building frontend...');
  execSync('cd client && npm run build', { stdio: 'inherit' });
  
  // Copy client dist to root
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  
  console.log('Copying build files...');
  fs.cpSync('client/dist', 'dist', { recursive: true });
  
  console.log('Build completed successfully!');
  console.log('Ready for Vercel deployment.');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
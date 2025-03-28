const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set environment to production
process.env.NODE_ENV = 'production';

// Build the client
console.log('Building client...');
execSync('cd client && npm run build', { stdio: 'inherit' });

// Copy client build to public directory
console.log('Copying client build to public directory...');
const clientBuildDir = path.join(__dirname, 'client', 'dist');
const publicDir = path.join(__dirname, 'public');

// Create public directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy files
fs.readdirSync(clientBuildDir).forEach(file => {
  const srcPath = path.join(clientBuildDir, file);
  const destPath = path.join(publicDir, file);
  
  if (fs.lstatSync(srcPath).isDirectory()) {
    // If it's a directory, copy recursively
    fs.cpSync(srcPath, destPath, { recursive: true });
  } else {
    // If it's a file, copy directly
    fs.copyFileSync(srcPath, destPath);
  }
});

console.log('Build completed successfully!');
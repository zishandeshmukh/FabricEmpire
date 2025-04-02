#!/usr/bin/env node

import 'dotenv/config';
import { execSync } from 'child_process';
import path from 'path';

console.log('Pushing Drizzle schema to database...');

// Load environment variables
console.log('📦 Loading environment variables...');
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set.');
  process.exit(1);
}

// Test database connection
console.log(`🔍 Testing connection to database: ${process.env.DATABASE_URL.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);

try {
  // Run database push with drizzle-kit in non-interactive mode
  console.log('🚀 Running database push...');
  execSync('npx drizzle-kit push:pg', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      // Set non-interactive mode to automatically accept prompts
      CI: 'true'
    }
  });
  
  console.log('✅ Database schema updated successfully');
} catch (error) {
  console.error('❌ Failed to update database schema:', error.message);
  process.exit(1);
}
// Setup release environment for frontend (align with backend style)
// Writes .env.production using required VITE_* variables

const fs = require('fs');
const path = require('path');

function requiredEnv(name) {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function main() {
  const root = process.cwd();
  const envPath = path.join(root, '.env.production');

  const backendUrl = requiredEnv('VITE_BACKEND_URL');
  const metricsEndpoint = process.env.VITE_METRICS_ENDPOINT || '';

  const file = [
    `VITE_BACKEND_URL=${backendUrl}`,
    `VITE_METRICS_ENDPOINT=${metricsEndpoint}`,
  ].join('\n') + '\n';

  fs.writeFileSync(envPath, file, { encoding: 'utf8' });
  console.log('Generated .env.production');
  console.log('VITE_BACKEND_URL:', backendUrl);
  console.log('VITE_METRICS_ENDPOINT:', metricsEndpoint ? '[set]' : '[not set]');
}

try {
  main();
} catch (err) {
  console.error('Environment setup failed:', err.message);
  process.exit(1);
}
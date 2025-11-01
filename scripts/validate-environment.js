// Validate CI environment for frontend (align with backend style)

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
}

function required(name) {
  const v = process.env[name];
  if (!v || v.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v.trim();
}

function main() {
  const backend = required('VITE_BACKEND_URL');
  if (!isValidUrl(backend)) {
    throw new Error(`VITE_BACKEND_URL is not a valid URL: ${backend}`);
  }

  const nodeVersion = process.version;
  console.log('Node version:', nodeVersion);
  console.log('VITE_BACKEND_URL:', backend);

  if (process.env.VITE_METRICS_ENDPOINT) {
    const m = process.env.VITE_METRICS_ENDPOINT.trim();
    if (!isValidUrl(m)) {
      console.warn('VITE_METRICS_ENDPOINT provided but not a valid URL:', m);
    } else {
      console.log('VITE_METRICS_ENDPOINT: [valid URL set]');
    }
  } else {
    console.log('VITE_METRICS_ENDPOINT: [not set]');
  }
}

try {
  main();
} catch (err) {
  console.error('Environment validation failed:', err.message);
  process.exit(1);
}
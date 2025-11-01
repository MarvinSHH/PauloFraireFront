// Release health check: polls the deployed frontend URL until healthy
// Uses global fetch (Node 18+) and retries

const MAX_RETRIES = parseInt(process.env.RELEASE_MAX_RETRIES || '20', 10); // ~4-5 min
const DELAY_MS = parseInt(process.env.RELEASE_RETRY_DELAY_MS || '15000', 10); // 15s

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function check(url) {
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const text = await res.text();
  if (!text || text.length === 0) {
    throw new Error('Empty response');
  }
  return true;
}

async function main() {
  const url = process.env.FRONTEND_PUBLIC_URL;
  if (!url || url.trim() === '') {
    console.error('FRONTEND_PUBLIC_URL secret is required for release health check');
    process.exit(1);
  }
  console.log('Checking deployed frontend:', url);

  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    attempt++;
    try {
      await check(url);
      console.log(`Healthy after attempt ${attempt}`);
      return;
    } catch (err) {
      console.log(`Attempt ${attempt} failed: ${err.message}. Retrying in ${DELAY_MS}ms...`);
      await sleep(DELAY_MS);
    }
  }

  console.error(`Release health check failed after ${MAX_RETRIES} attempts.`);
  process.exit(1);
}

main().catch((err) => {
  console.error('Unexpected error in health check:', err);
  process.exit(1);
});
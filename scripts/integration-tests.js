// Frontend integration tests runner (wrapper), aligns with backend style
// Runs vitest test suite in CI

const { spawn } = require('child_process');

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts });
    p.on('close', (code) => {
      if (code !== 0) return reject(new Error(`${cmd} exited with code ${code}`));
      resolve();
    });
  });
}

async function main() {
  console.log('Running integration tests with Vitest...');
  await run('npx', ['vitest', 'run', '--reporter', 'verbose']);
}

main().catch((err) => {
  console.error('Integration tests failed:', err.message);
  process.exit(1);
});
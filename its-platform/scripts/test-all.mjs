#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

function run(cmd, args = [], env = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd: root,
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, ...env },
    });
    proc.on('close', (code) => {
      if (code === 0) resolve(code);
      else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

async function main() {
  try {
    console.log('=== Running typecheck ===');
    await run('npm', ['run', 'typecheck']);
    console.log('\n=== Running build ===');
    await run('npm', ['run', 'build']);
    console.log('\n=== Running tests ===');
    await run('node', ['--experimental-vm-modules', 'node_modules/jest/bin/jest.js', '--maxTests=50000', '--maxWorkers=1', '--no-coverage']);
    console.log('\n=== Running domain-isolation-check ===');
    await run('node', ['scripts/domain-isolation-check.mjs']);
    console.log('\n=== Running content-check ===');
    await run('node', ['scripts/content-check.mjs']);
    console.log('\n=== Running contract-check ===');
    await run('node', ['contract-check.mjs']);
    console.log('\n=== All checks passed ===');
    process.exit(0);
  } catch (err) {
    console.error('\n=== CHECK FAILED ===');
    console.error(err.message);
    process.exit(1);
  }
}

main();

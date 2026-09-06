const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[33m%s\x1b[0m', '══════════════════════════════════════════════════════════════════');
console.log('\x1b[33m%s\x1b[0m', '       LUMIÈRE — TIMELESS BY DESIGN | LUXURY ATELIER             ');
console.log('\x1b[33m%s\x1b[0m', '══════════════════════════════════════════════════════════════════');
console.log('\x1b[36m%s\x1b[0m', ' Starting Express API Server & Vite React Frontend concurrently...\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Launch Backend API Server
const serverProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
});

// 2. Launch Vite Client
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n\x1b[33m%s\x1b[0m', 'Shutting down Lumière development services...');
  serverProcess.kill();
  clientProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

serverProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Server process exited with code ${code}`);
  }
});

clientProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Client process exited with code ${code}`);
  }
});

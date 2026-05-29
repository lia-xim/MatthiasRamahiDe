import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';

const webPort = Number(process.env.WEB_PREVIEW_PORT || 4321);
const webHost = process.env.WEB_PREVIEW_HOST || '127.0.0.1';
const root = process.cwd();

function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const finish = (value) => {
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(500);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
  });
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const commandLine = formatCommand(command, args);
    console.log(`\n> ${commandLine}`);
    const child = spawnCommand(command, args, {
      cwd: root,
      env: process.env,
      stdio: 'inherit',
      ...options,
    });

    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`));
    });
  });
}

function start(command, args) {
  const commandLine = formatCommand(command, args);
  console.log(`\n> ${commandLine}`);
  return spawnCommand(command, args, {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });
}

function quoteArg(arg) {
  return /^[A-Za-z0-9_./:@-]+$/.test(arg) ? arg : `"${arg.replace(/"/g, '\\"')}"`;
}

function formatCommand(command, args) {
  return [command, ...args].map(quoteArg).join(' ');
}

function spawnCommand(command, args, options) {
  if (process.platform !== 'win32') {
    return spawn(command, args, options);
  }

  return spawn(formatCommand(command, args), {
    ...options,
    shell: true,
  });
}

async function waitForPort(port, host, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await isPortOpen(port, host)) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Astro preview did not become reachable on ${host}:${port} within ${timeoutMs}ms.`);
}

function stopProcessTree(child) {
  if (!child?.pid || child.killed) return;

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    return;
  }

  child.kill('SIGTERM');
}

if (await isPortOpen(webPort, webHost)) {
  console.error(`Port ${webPort} is already in use.`);
  console.error('Stop the local Astro server before running production:check:');
  console.error('  corepack pnpm local:stop');
  console.error('');
  console.error('Reason: production:check starts its own Astro preview from the freshly built dist directory.');
  process.exit(1);
}

let preview;

try {
  await run('corepack', ['pnpm', 'cms:audit-production', '--', '--strict']);
  await run('corepack', ['pnpm', 'cms:audit-seo', '--', '--strict']);
  await run('corepack', ['pnpm', 'web:build']);
  await run('corepack', ['pnpm', 'cms:build']);

  preview = start('corepack', ['pnpm', '--filter', '@matthias-ramahi/web', 'preview']);
  await waitForPort(webPort, webHost, 45000);

  await run('corepack', ['pnpm', 'web:test:legacy-routes']);
  await run('corepack', ['pnpm', 'web:test:visual']);
} finally {
  stopProcessTree(preview);
}

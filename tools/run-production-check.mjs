import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';

let webPort = Number(process.env.WEB_PREVIEW_PORT || 4321);
const webHost = process.env.WEB_PREVIEW_HOST || '127.0.0.1';
const shouldStartPreview = process.env.PRODUCTION_CHECK_START_PREVIEW !== 'false';
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

async function findAvailablePort(preferredPort, host) {
  if (!(await isPortOpen(preferredPort, host))) return preferredPort;

  for (let port = preferredPort + 1; port <= preferredPort + 50; port += 1) {
    if (!(await isPortOpen(port, host))) return port;
  }

  throw new Error(`No free Astro preview port found from ${preferredPort} to ${preferredPort + 50}.`);
}

function stopProcessTree(child) {
  if (!child?.pid || child.killed) return;

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    return;
  }

  child.kill('SIGTERM');
}

let preview;

try {
  await run('corepack', ['pnpm', 'cms:audit-production', '--', '--strict']);
  await run('corepack', ['pnpm', 'cms:audit-seo', '--', '--strict']);
  await run('corepack', ['pnpm', 'web:build']);
  await run('corepack', ['pnpm', 'native:guard']);
  await run('corepack', ['pnpm', 'cms:build']);

  if (shouldStartPreview) {
    const requestedWebPort = webPort;
    webPort = await findAvailablePort(webPort, webHost);
    if (webPort !== requestedWebPort) {
      console.log(`Port ${requestedWebPort} is already in use; production:check will use ${webPort} for its temporary Astro preview.`);
    }

    preview = start('corepack', [
      'pnpm',
      '--filter',
      '@matthias-ramahi/web',
      'exec',
      'astro',
      'preview',
      '--host',
      '0.0.0.0',
      '--port',
      String(webPort),
    ]);
    await waitForPort(webPort, webHost, 45000);
  }

  const previewBaseUrl = shouldStartPreview ? `http://${webHost}:${webPort}` : '';
  const routeAuditOptions = previewBaseUrl
    ? { env: { ...process.env, LEGACY_AUDIT_BASE_URL: previewBaseUrl } }
    : {};
  const visualOptions = previewBaseUrl ? { env: { ...process.env, VISUAL_BASE_URL: previewBaseUrl } } : {};

  await run('corepack', ['pnpm', 'web:test:legacy-routes'], routeAuditOptions);
  await run('corepack', ['pnpm', 'web:test:visual'], visualOptions);
} finally {
  stopProcessTree(preview);
}

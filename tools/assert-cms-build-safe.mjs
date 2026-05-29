import net from 'node:net';
import fs from 'node:fs/promises';
import path from 'node:path';

const port = Number(process.env.PAYLOAD_LOCAL_PORT || 3000);
const host = process.env.PAYLOAD_LOCAL_HOST || '127.0.0.1';
const allow = process.env.ALLOW_CMS_BUILD_WITH_RUNNING_SERVER === 'true';

function isPortOpen() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const finish = (value) => {
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(750);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
  });
}

if (!allow && (await isPortOpen())) {
  console.error(`Payload/Next appears to be running on ${host}:${port}.`);
  console.error('Stop the local stack before running cms:build or production:check:');
  console.error('  corepack pnpm local:stop');
  console.error('');
  console.error('Reason: Next builds rewrite apps/cms/.next and can leave the running Payload admin without CSS/assets.');
  console.error('If you intentionally want to override this guard, set ALLOW_CMS_BUILD_WITH_RUNNING_SERVER=true.');
  process.exit(1);
}

const cmsNextDir = path.resolve(process.cwd(), 'apps/cms/.next');
const cmsTsBuildInfo = path.resolve(process.cwd(), 'apps/cms/tsconfig.tsbuildinfo');
await fs.rm(cmsNextDir, { recursive: true, force: true });
await fs.rm(cmsTsBuildInfo, { force: true });

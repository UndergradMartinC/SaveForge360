const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { join, normalize } = require('node:path');
const { Package } = require('stfs-ts');

const WEB_ROOT = join(__dirname, '..', 'web');
const MAX_IMPORT_BYTES = 32 * 1024 * 1024;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

function filesIn(directory, prefix = '') {
  const files = Object.values(directory.files).map((entry) => ({ path: `${prefix}${entry.name}`, size: entry.size, entry }));
  const nested = Object.values(directory.dirs).flatMap((child) => filesIn(child, `${prefix}${child.name}/`));
  return [...files, ...nested];
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_IMPORT_BYTES) {
        request.destroy();
        reject(new Error('Imports are limited to 32 MB in this preview.'));
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => resolve(Buffer.concat(chunks)));
    request.on('error', reject);
  });
}

function json(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  response.end(JSON.stringify(body));
}

async function inspectStfs(request, response) {
  try {
    const input = await readBody(request);
    const magic = input.subarray(0, 4).toString('ascii');
    if (!['CON ', 'LIVE', 'PIRS'].includes(magic)) throw new Error('This is not an Xbox 360 CON, LIVE, or PIRS package.');
    const packageFile = new Package(input);
    const files = filesIn(packageFile.Root);
    const mcla = files.find((file) => file.path.toLowerCase() === 'mc4.sav');
    const heroSave = files.find((file) => file.path.toLowerCase() === 'herosave.bin');
    const publicInfo = files.find((file) => file.path.toLowerCase() === 'fable2pubinfo.xml');
    const module = mcla ? {
      id: 'mcla',
      name: 'Midnight Club: Los Angeles',
      innerSave: mcla.entry.data().toString('base64')
    } : heroSave && publicInfo ? {
      id: 'fable2',
      name: 'Fable II',
      heroSave: heroSave.entry.data().toString('base64'),
      publicInfo: publicInfo.entry.data().toString('base64')
    } : null;
    json(response, 200, {
      magic,
      files: files.map(({ path, size }) => ({ path, size })),
      module
    });
  } catch (error) {
    json(response, 400, { error: error.message || 'The package could not be inspected.' });
  }
}

async function serveStatic(request, response) {
  const requested = request.url === '/' ? '/index.html' : request.url;
  const path = normalize(join(WEB_ROOT, requested));
  if (!path.startsWith(WEB_ROOT)) return json(response, 404, { error: 'Not found.' });
  try {
    const data = await readFile(path);
    const ext = path.slice(path.lastIndexOf('.'));
    response.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream', 'cache-control': 'no-store' });
    response.end(data);
  } catch {
    json(response, 404, { error: 'Not found.' });
  }
}

const port = Number(process.env.PORT || 4173);
createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/api/inspect') return inspectStfs(request, response);
  return serveStatic(request, response);
}).listen(port, '127.0.0.1', () => {
  console.log(`SaveForge360 preview: http://127.0.0.1:${port}`);
});

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const publicDirectory = new URL('../public/', import.meta.url);
const contentTypes = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function publicFile(path) {
  const requested = path === '/' ? 'index.html' : path.slice(1);
  if (!requested || requested.includes('..') || !/^[a-zA-Z0-9._/-]+$/.test(requested)) return null;
  return new URL(requested, publicDirectory);
}

export function createApp() {
  return createServer(async (request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end('Method not allowed');
      return;
    }
    const path = new URL(request.url, 'http://localhost').pathname;
    if (path === '/health') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ status: 'ok', project: 'ten18-guitar-tone-platform' }));
      return;
    }
    const file = publicFile(path);
    if (!file) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    try {
      const content = await readFile(file);
      const extension = path.includes('.') ? path.slice(path.lastIndexOf('.')) : '.html';
      response.writeHead(200, { 'Content-Type': contentTypes[extension] ?? 'application/octet-stream' });
      response.end(content);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });
}

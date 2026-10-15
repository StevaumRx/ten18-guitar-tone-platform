import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const page = new URL('../public/index.html', import.meta.url);

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
    if (path !== '/') {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }
    try {
      const content = await readFile(page);
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(content);
    } catch {
      response.writeHead(500);
      response.end('Unable to load the development page');
    }
  });
}

import { renderToString } from 'react-dom/server';

import Index from './index.tsx';

Bun.serve({
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (pathname === '/') {
      return new Response(renderToString(<Index />), {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } else {
      return new Response('Not found', { status: 404 });
    }
  },
  port: process.env.PORT || 8080,
});

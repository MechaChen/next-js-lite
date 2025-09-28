import { renderToString } from 'react-dom/server';

import Index from './index.tsx';
import App from './App.tsx';

Bun.serve({
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (pathname === '/') {
      const htmlFromReact = renderToString(
        <Index>
          <App />
        </Index>
      );

      return new Response(htmlFromReact, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    } else {
      return new Response('Not found', { status: 404 });
    }
  },
  port: process.env.PORT || 8080,
});

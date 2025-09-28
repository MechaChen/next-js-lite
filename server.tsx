import { renderToString } from 'react-dom/server';

import Index from './server/index.tsx';

Bun.serve({
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (pathname === '/') {
      const App = require('./client/App.tsx');
      const Component = App.default;
      const ComponentProps = await App.getServerSideProps();

      const htmlFromReact = renderToString(
        <Index
          initialProps={ComponentProps.props}
          children={<Component {...ComponentProps.props} />}
        />
      );

      return new Response(htmlFromReact, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    } else if (pathname === '/index.js') {
      const bundle = await Bun.build({
        entrypoints: ['./client/index.tsx'],
      });

      return new Response(await bundle.outputs[0]?.text(), {
        headers: {
          'Content-Type': 'text/javascript; charset=utf-8',
        },
      });
    } else {
      return new Response('Not found', { status: 404 });
    }
  },
  port: process.env.PORT || 8080,
});

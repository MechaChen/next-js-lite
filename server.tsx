import { renderToString } from 'react-dom/server';

import Index from './server/index.tsx';

Bun.serve({
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (pathname.startsWith('/client-')) {
      // return pre-generated bundled client scripts, which includes compiled page component code as well.
      // and the client script will start hydrating the Page component with bundled Page code
      const fileName = pathname.replace('/client-', 'client-');
      const filePath = `./dist/${fileName}`;

      try {
        const file = Bun.file(filePath);
        const content = await file.text();

        return new Response(content, {
          headers: {
            'Content-Type': 'text/javascript; charset=utf-8',
          },
        });
      } catch (error) {
        return new Response('Client script not found', { status: 404 });
      }
    } else {
      const moduleName = pathname.replace('/', '') || 'index';

      try {
        const App = require(`./pages/${moduleName}.tsx`);
        const Component = App.default;
        const ComponentProps = await App.getServerSideProps();

        // prepare the client script for hydration, including the path of page component to be loaded
        const clientScriptContent = `
          import { hydrateRoot } from 'react-dom/client';
          import React from 'react';
          import App from './pages/${moduleName}.tsx';
          
          const domNode = document.getElementById('root');
          if (domNode) {
            hydrateRoot(domNode, React.createElement(App, window.initialProps || {}));
          }
        `;

        // generate the hydration script file
        const tempClientFile = `./temp-client-${moduleName}.tsx`;
        await Bun.write(tempClientFile, clientScriptContent);

        // bundle the script file, which will include 2 parts:
          // the hydration script
          // the Page component, which will be resolved from the `import` by the bundler and bundled together into the final file
        await Bun.build({
          entrypoints: [tempClientFile],
          target: 'browser',
          outdir: './dist',
          naming: {
            entry: `client-${moduleName}.js`,
          },
        });

        // remove the temp uncompiled hydration script at the build time
        try {
          await Bun.file(tempClientFile).unlink();
        } catch (error) {
        }

        const clientScriptUrl = `/client-${moduleName}.js`;

        const htmlFromReact = renderToString(
          <Index
            initialProps={ComponentProps.props}
            children={<Component {...ComponentProps.props} />}
            clientScriptUrl={clientScriptUrl}
          />
        );

        return new Response(htmlFromReact, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        });
      } catch (error) {
        return new Response('Not found', { status: 404 });
      }
    }
  },
  port: process.env.PORT || 8080,
});

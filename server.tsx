import { renderToString } from 'react-dom/server';

import Index from './server/index.tsx';

Bun.serve({
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (pathname.startsWith('/client-')) {
      // 提供打包後的客戶端腳本
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

        // 生成客戶端腳本檔案
        const clientScriptContent = `
          import { hydrateRoot } from 'react-dom/client';
          import React from 'react';
          import App from './pages/${moduleName}.tsx';
          
          const domNode = document.getElementById('root');
          if (domNode) {
            hydrateRoot(domNode, React.createElement(App, window.initialProps || {}));
          }
        `;

        // 將客戶端腳本寫入臨時檔案
        const tempClientFile = `./temp-client-${moduleName}.tsx`;
        await Bun.write(tempClientFile, clientScriptContent);

        // 打包客戶端腳本
        await Bun.build({
          entrypoints: [tempClientFile],
          target: 'browser',
          outdir: './dist',
          naming: {
            entry: `client-${moduleName}.js`,
          },
        });

        // 刪除臨時檔案
        try {
          await Bun.file(tempClientFile).unlink();
        } catch (error) {
          // 忽略刪除錯誤
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

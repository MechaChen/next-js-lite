import React from 'react';
import type { ReactNode } from 'react';

type IndexProps = {
  initialProps: any;
  children: ReactNode;
  clientScriptUrl?: string;
};

export default function Index({
  initialProps,
  children,
  clientScriptUrl,
}: IndexProps) {
  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.initialProps = ${JSON.stringify(initialProps)};
            `,
          }}
        ></script>
        {clientScriptUrl && (
          <script type="module" src={clientScriptUrl}></script>
        )}
      </head>
      <body>
        <h1>Next.js Lite</h1>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

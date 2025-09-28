import React from 'react';
import type { ReactNode } from 'react';

type IndexProps = {
  initialProps: any;
  children: ReactNode;
};

export default function Index({ initialProps, children }: IndexProps) {
  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.initialProps = ${JSON.stringify(initialProps)}`,
          }}
        ></script>
        <script defer src="./index.js"></script>
      </head>
      <body>
        <h1>Next.js Lite</h1>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

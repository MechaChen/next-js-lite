import React from 'react';
import type { ReactNode } from 'react';

type IndexProps = {
  children: ReactNode;
};

export default function Index({ children }: IndexProps) {
  return (
    <html>
      <head>
        <script defer src="./index.js"></script>
      </head>
      <body>
        <h1>Next.js Lite</h1>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

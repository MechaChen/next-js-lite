import { hydrateRoot } from 'react-dom/client';
import App from '../pages/index';

const domNode = document.getElementById('root');

declare global {
  interface Window {
    initialProps: any;
    moduleName: string;
  }
}

hydrateRoot(domNode!, <App {...window.initialProps} />);

import App from './App';
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');

declare global {
  interface Window {
    initialProps: AppProps;
  }
}

hydrateRoot(domNode!, <App {...window.initialProps} />);

import App from './App.tsx';
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');

hydrateRoot(domNode!, <App />);

import React from 'react';
import { createRoot } from 'react-dom/client';
import 'typeface-roboto';

import App from './components/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './styles/global.scss';

const node = document.getElementById('root');

if (!node) {
  throw new Error('Root node #root not found');
}

const root = createRoot(node);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

serviceWorkerRegistration.register({
  onUpdate: registration => {
    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener('statechange', event => {
        if ((event.target as ServiceWorker).state === 'activated') {
          window.location.reload();
        }
      });
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  },
});

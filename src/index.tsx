import React from 'react';
import { createRoot } from 'react-dom/client';
import 'typeface-roboto';

import App from './components/App';
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

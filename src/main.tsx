import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './assets/i18n';

import store from './redux/store';
import App from './App';

import './index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <div></div>
    </Provider>
  </React.StrictMode>
);

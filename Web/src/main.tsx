import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';

import { store } from '@Api/store.ts';
import App from './App.tsx'

import "semantic-ui-css/semantic.min.css";
import './index.css'
import "./i18n.ts";
import { LayoutProvider } from '@Context/LayoutContext.tsx';
import errorClear from '@Utils/NodeErrorHelper.tsx';

errorClear()

const container = document.getElementById('root');
const root = container && createRoot(container);

if (root) {
  root.render(
    <Provider store={store}>
      <LayoutProvider>
        <App />
      </LayoutProvider>
    </Provider>
  )
};
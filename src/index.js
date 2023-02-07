import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import './index.scss';

import store from './store';

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '*',
          element: (
            <>
              <App></App>
              <ScrollRestoration></ScrollRestoration>
            </>
          ),
        },
      ])}
    ></RouterProvider>
  </Provider>
);

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app';

ReactDOM.render(
  <AppContainer >
    <App />
  </AppContainer>,
  document.getElementById('root')
);

if ((module as any).hot) {
  (module as any).hot.accept('./app', () => {
    const App = (require('./app') as any).default;
    ReactDOM.render(
      <AppContainer >
        <App />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}

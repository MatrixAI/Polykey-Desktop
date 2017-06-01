// this is the entry point to the electron app
// desktop app for Linux, Windows and Mac
// alternative to this a more simpler CLI
// there's no web app for polykey
// no need..

// react stuff
import React from 'react';
import ReactDOM from 'react-dom';

// redux stuff
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { save, load } from 'redux-localstorage-simple';

import appConfig from 'config';
import appReducer from 'reducers';
import Routes from 'routes';

// save to local storage each time an action is handled by the app reducer
const createStoreWithMiddleware = applyMiddleware(save())(createStore);

// loading from local storage to create the initial store
const store = createStoreWithMiddleware(appReducer, load());

ReactDOM.render(
  <Provider store={store}>
    <Routes config={config} />
  </Provider>,
  document.getElementById('root')
);

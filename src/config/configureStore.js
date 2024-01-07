
import reducers from '../reducers';

import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';


import thunk from 'redux-thunk';

const middleware = [thunk];

if (process.env.NODE_ENV === 'development') {
  middleware.push(createLogger());
}
// const Store = createStore(reducers, compose(applyMiddleware(...middleware), window.devToolsExtension ? window.devToolsExtension() : f => f));

const Store = createStore(reducers, applyMiddleware(...middleware));

export default Store;

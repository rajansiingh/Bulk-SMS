import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import monitorReducersEnhancer from './enhancers/monitorReducers';
import loggerMiddleware from './middleware/logger';
import Reducers, { reducersList } from '../reducers';

export default function configureStore(preloadedState) {
  const rootReducer = Reducers();
  // Checking whether initialState contains any async reducers
  // i..e, reducers that are not returned from combineReducers
  // during initial store creation
  const asyncReducersKeys =
    preloadedState &&
    Object.keys(preloadedState).filter(key => {
      // eslint-disable-next-line no-prototype-builtins
      return !reducersList.hasOwnProperty(key);
    });

  // If found delete them from initialState otherwise
  // getting a warning message 'Unexpected key
  // Expected to find one of the known reducer keys instead [reducersList...]
  if (asyncReducersKeys.length) {
    asyncReducersKeys.forEach(key => {
      delete preloadedState[key]; // eslint-disable-line
    });
  }
  const isDevEnv = process.env.NODE_ENV !== 'production';
  const middlewares = [thunkMiddleware];
  if (isDevEnv) {
    middlewares.push(loggerMiddleware);
  }
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  let composedEnhancers;
  if (isDevEnv) {
    enhancers.push(monitorReducersEnhancer);
    composedEnhancers = composeWithDevTools(...enhancers);
  } else {
    composedEnhancers = compose(...enhancers);
  }
  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  if (isDevEnv && module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}

export function injectAsyncReducer(store, asyncReducers) {
  store.asyncReducers = {...store.asyncReducers, ...asyncReducers}; // eslint-disable-line
  store.replaceReducer(Reducers(store.asyncReducers));
}

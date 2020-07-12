import { combineReducers } from 'redux';
import reducers from './list';

export const reducersList = {
  ...reducers,
};
export default function rootReducer(asyncReducers = {}) {
  return combineReducers({
    ...reducersList,
    ...asyncReducers,
  });
}

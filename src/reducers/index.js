import { combineReducers } from 'redux';
export const reducersList = {};
export default function rootReducer(asyncReducers) {
  return combineReducers({
    ...reducersList,
    ...asyncReducers
  });
}

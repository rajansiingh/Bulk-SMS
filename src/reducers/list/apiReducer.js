/**
 * Author : rajansingh
 * Created On : 17/07/20
 */
import _ from 'lodash';
import {
  CLEAR_API_DATA,
  ERROR_IN_API,
  REQUEST_API,
  RESPONSE_FROM_API,
} from '../../constants/mutationTypes';

const initialState = {
  isFetching: false,
  response: undefined,
  error: undefined,
};

function setApiState(state = initialState, action) {
  switch (action.type) {
    case ERROR_IN_API:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error,
        headers: action.headers,
      });
    case REQUEST_API:
      return Object.assign(
        {},
        state,
        {
          isFetching: true,
        },
        {
          error: null,
          response: action.retainPrevious ? state.response : null,
        },
      );
    case RESPONSE_FROM_API:
      return Object.assign({}, state, {
        isFetching: false,
        response: action.response,
        lastUpdated: action.receivedAt,
        headers: action.headers,
      });
    default:
      return state;
  }
}

export default function apiResults(state = {}, action) {
  switch (action.type) {
    case ERROR_IN_API:
    case RESPONSE_FROM_API:
    case REQUEST_API:
      // Return the existing state when api doesn't have any response (Like logout api, where 200 OK is considered success)
      return Object.assign({}, state, {
        [action.key]: setApiState(state[action.key], action),
      });
    case CLEAR_API_DATA:
      return _.omit(state, action.key);
    default:
      return state;
  }
}

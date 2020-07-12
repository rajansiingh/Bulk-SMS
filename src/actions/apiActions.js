/**
 * Author : rajansingh
 * Created On : 16/07/20
 */
import _ from 'lodash';
// Please read syntax https://www.npmjs.com/package/node-fetch
import http from '../common/http';
import {
  CLEAR_API_DATA,
  ERROR_IN_API,
  REQUEST_API,
  RESPONSE_FROM_API,
} from '../constants/mutationTypes';
import apiStub from '../stubs/api'; // TODO: Don't import stubs in production
import { addParamsToUrl } from '../utils/queryParamsUtils';

function requestApi(params) {
  return {
    type: REQUEST_API,
    key: params.responseKey,
    retainPrevious: params.retainPrevious,
  };
}

export function clearApiData(key) {
  return {
    type: CLEAR_API_DATA,
    key,
  };
}

function handleApiError(key, error, headers) {
  return {
    type: ERROR_IN_API,
    key,
    error,
    receivedAt: Date.now(),
    headers,
  };
}

function receiveApiResponse(key, response, headers) {
  return {
    type: RESPONSE_FROM_API,
    key,
    response,
    receivedAt: Date.now(),
    headers,
  };
}

const fetchWrapper = () => {
  const apiCache = {};
  return async (params, stubInfo) => {
    let key = params.apiUrl;
    const queryParams = _.get(params, ['opts', 'queryParams']);
    if (queryParams) {
      key = addParamsToUrl(params.apiUrl, queryParams);
    }
    if (stubInfo && stubInfo.stub) {
      if (typeof apiStub[stubInfo.stubKey] === 'function') {
        return { json: apiStub[stubInfo.stubKey](params), status: 200 };
      }
      return { json: apiStub[stubInfo.stubKey], status: 200 };
    }
    if (_.has(params, ['opts.cache']) && apiCache[key]) {
      return apiCache[key];
    }
    const resp = await http(params.apiUrl, params.opts);
    if (
      _.has(params, ['opts', 'cache']) &&
      resp.status >= 200 &&
      resp.status <= 304
    ) {
      apiCache[key] = resp;
    }
    return resp;
  };
};

const doFetch = fetchWrapper();

export function getApiData(params, stubInfo) {
  return dispatch => {
    dispatch(requestApi(params));
    return doFetch(params, stubInfo)
      .then(({ json: val, status, headers }) => {
        if (status >= 200 && status <= 304) {
          dispatch(receiveApiResponse(params.responseKey, val, headers));
          if (params.actionToCall) {
            dispatch(params.actionToCall(val));
          }
        } else {
          dispatch(handleApiError(params.responseKey, val, headers));
        }
        return { json: val, status };
      })
      .catch(async error => {
        // Logout of the system when any api throws a 401 error (401 : unauthorised)
        if (error.response.status === 400) {
          const err = _.clone(error.response);
          const errorJSON = await err.json();
          dispatch(handleApiError(params.responseKey, errorJSON));
        } else {
          dispatch(handleApiError(params.responseKey, error));
        }
        return error;
      });
  };
}

function shouldFetchPosts(state, params) {
  const posts = state.apiResults[params.responseKey];
  return !posts || !posts.isFetching;
}

export function callApiIfNeeded(params) {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), params)) {
      // Dispatch a thunk from thunk!
      return dispatch(getApiData(params));
    }
    // Let the calling code know there's nothing to wait for.
    return Promise.resolve();
  };
}

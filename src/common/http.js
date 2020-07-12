/**
 * Author : rajansingh
 * Created On : 17/07/20
 */
import fetch from 'node-fetch';
import _ from 'lodash';
import checkRequest from './httpRequestInterceptor';
import checkResponse from './httpResponseInterceptor';
import { addParamsToUrl, getReqIdentifier } from '../utils/queryParamsUtils';

let apisUnderProcess = [];
const handleAbort = requestObj => {
  const {
    params: { method },
    url,
  } = requestObj;
  const controller = new AbortController();
  const { signal } = controller;
  const reqIdentifier = getReqIdentifier(method, url);
  const underProcess = apisUnderProcess.find(x => x.req === reqIdentifier);
  if (underProcess) {
    underProcess.controller.abort();
  }
  apisUnderProcess = apisUnderProcess.filter(x => x.req !== reqIdentifier);
  apisUnderProcess.push({ req: reqIdentifier, controller });
  return signal;
};

const httpFetch = async (
  url,
  opts = { params: { queryParams: {} }, abortPrevious: false },
) => {
  let response;
  const requestObj = checkRequest(url, opts);
  const reqIdentifier = getReqIdentifier(
    requestObj.params.method,
    requestObj.url,
  );
  if (!_.isEmpty(opts.params.queryParams)) {
    requestObj.url = addParamsToUrl(
      requestObj.url,
      requestObj.params.queryParams,
    );
    delete requestObj.params.queryParams;
  }
  try {
    if (opts.abortPrevious && typeof AbortController !== 'undefined') {
      requestObj.params.signal = handleAbort(requestObj);
    }
    response = await fetch(requestObj.url, _.omit(requestObj.params, ['cache']))
      .then(checkResponse)
      .then(() => {
        if (opts.abortPrevious) {
          apisUnderProcess = apisUnderProcess.filter(
            x => x.req !== reqIdentifier,
          );
        }
      });
  } catch (e) {
    if (opts.abortPrevious) {
      apisUnderProcess = apisUnderProcess.filter(x => x.req !== reqIdentifier);
    }
    // eslint-disable-next-line no-console
    console.log('Not able to fetch response for ', url, e);
    throw e;
  }
  return response;
};

export default httpFetch;

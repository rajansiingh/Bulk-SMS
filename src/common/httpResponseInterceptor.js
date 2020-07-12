/**
 * Author : rajansingh
 * Created On : 17/07/20
 */
import _ from 'lodash';
import { safeStringify } from '../utils/queryParamsUtils';

const getPostHeaders = (header, options) => {
  let headers = header;
  if (!headers) {
    headers = {};
  }
  headers['Cache-Control'] = 'no-cache';
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  return { headers: Object.assign({}, headers) };
};

const checkRequest = (url, options) => {
  const modifiedUrl = url;

  let params = _.clone(options);
  const headers = getPostHeaders(params && params.headers, options);
  params.method = options.method || 'GET';
  params.body = !(params.body instanceof FormData)
    ? safeStringify(params.body)
    : params.body;
  params.timeout = 5000; // set timeout
  params = { ...headers, ...params };

  return {
    url: modifiedUrl,
    params,
  };
};

export default checkRequest;

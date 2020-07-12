/**
 * Author : rajansingh
 * Created On : 17/07/20
 */
import queryString from 'query-string';

export const getReqIdentifier = (method, url) => {
  let pathname = url;
  if (url.indexOf('?') > -1) {
    pathname = url.substr(0, url.indexOf('?'));
  }
  return method + pathname;
};

export const addParamsToUrl = (relativeUrl = '', queryParam) => {
  const existingObj = queryString.parseUrl(relativeUrl);
  const newParams = { ...existingObj.query, ...queryParam };
  return `${existingObj.url}${queryString.stringify(newParams)}`;
};

export const safeStringify = () => {};

/**
 * @module webgis4u/util/web/sendRequest
 */

import { encodeQueryData } from './encodeQueryData';

/**
 * Sends a request
 * @param {object} options The options
 * @param {string} options.url The url
 * @param {string} options.type The type
 * @param {number} options.timeout The timeout
 * @param {object} [options.data] The data used as query parameters
 * @param {function} options.error The error callback
 * @param {function} options.success The success callback
 */
export function sendRequest(options) {
  const {
    url, type, timeout, data,
    error, success,
  } = options;

  const urlToUse = (!data)
    ? url
    : `${url}?${encodeQueryData(data)}`;

  const request = new XMLHttpRequest();
  request.open(type, urlToUse, true);
  request.timeout = timeout;
  request.responseType = 'json';
  // Set callbacks
  request.onerror = (r, e) => error(request, e.type, request.statusText);
  request.onload = () => {
    const { status } = request;
    if (status >= 200 && status < 400) {
      success(request.response);
    } else {
      error(request, request.statusText, request.statusText);
    }
  };
  // Finally send the request
  request.send();
}

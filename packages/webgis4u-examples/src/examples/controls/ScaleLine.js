import source from 'raw-loader!./ScaleLine.src';

/**
 * The name of the example
 */
const name = 'ScaleLine';

/**
 * Loads the example module
 *
 * @returns {Promise} A promise that resolves with the loaded module
 */
function load() {
  return import(/* webpackChunkName: "example.ScaleLine" */ './ScaleLine.src.js');
}

export default {
  name,
  load,
  source,
};

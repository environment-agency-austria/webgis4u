import source from 'raw-loader!./Search.src';

/**
 * The name of the example
 */
const name = 'Search';

/**
 * Loads the example module
 *
 * @returns {Promise} A promise that resolves with the loaded module
 */
function load() {
  return import(/* webpackChunkName: "example.Search" */ './Search.src.js');
}

export default {
  name,
  load,
  source,
};

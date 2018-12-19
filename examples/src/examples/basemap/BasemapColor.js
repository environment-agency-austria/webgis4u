import source from 'raw-loader!./BasemapColor.src';

/**
 * The name of the example
 */
const name = 'Exmaple 1';

/**
 * Loads the example module
 *
 * @returns {Promise} A promise that resolves with the loaded module
 */
function load() {
  return import(/* webpackChunkName: "example.BasemapColor" */ './BasemapColor.src.js');
}

export default {
  name,
  load,
  source,
};

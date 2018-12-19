import source from 'raw-loader!./PanBar.src';

/**
 * The name of the example
 */
const name = 'PanBar';

/**
 * Loads the example module
 *
 * @returns {Promise} A promise that resolves with the loaded module
 */
function load() {
  return import(/* webpackChunkName: "example.PanBar" */ './PanBar.src.js');
}

export default {
  name,
  load,
  source,
};

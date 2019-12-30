import source from 'raw-loader!./ClusterZoom.src';

/**
 * The name of the example
 */
const name = 'ClusterZoom';

/**
 * Loads the example module
 *
 * @returns {Promise} A promise that resolves with the loaded module
 */
function load() {
  return import(/* webpackChunkName: "example.ClusterZoom" */ './ClusterZoom.src.js');
}

export default {
  name,
  load,
  source,
};

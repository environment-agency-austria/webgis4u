import source from 'raw-loader!./OverviewMap.src';

/**
 * The name of the example
 */
const name = 'OverviewMap';

/**
 * Loads the example module
 *
 * @returns {Promise} A promise that resolves with the loaded module
 */
function load() {
  return import(/* webpackChunkName: "example.OverviewMap" */ './OverviewMap.src.js');
}

export default {
  name,
  load,
  source,
};

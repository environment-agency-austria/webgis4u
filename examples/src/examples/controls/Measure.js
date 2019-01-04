import source from 'raw-loader!./Measure.src';

/**
 * The name of the example
 */
const name = 'Measure';

/**
 * Loads the example module
 *
 * @returns {Promise} A promise that resolves with the loaded module
 */
function load() {
  return import(/* webpackChunkName: "example.Measure" */ './Measure.src.js');
}

export default {
  name,
  load,
  source,
};

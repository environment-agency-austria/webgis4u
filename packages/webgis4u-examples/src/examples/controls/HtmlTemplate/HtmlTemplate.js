import source from 'raw-loader!./HtmlTemplate.src';

/**
 * The name of the example
 */
const name = 'HtmlTemplate';

/**
 * Loads the example module
 *
 * @returns {Promise} A promise that resolves with the loaded module
 */
function load() {
  return import(/* webpackChunkName: "example.HtmlTemplate" */ './HtmlTemplate.src.js');
}

export default {
  name,
  load,
  source,
};

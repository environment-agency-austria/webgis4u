/**
 * @module webgis4u/ol/control/Search
 */

import Control from 'ol/control/Control';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import * as proj from 'ol/proj';
import VectorSource from 'ol/source/Vector';

import { debounce } from '../../util/function/debounce';
import { sendRequest } from '../../util/web/sendRequest';

import { getIconStyle } from '../style/style';
import { zoomToLayerExtent } from '../util/zoomToLayerExtent';

import './Search/Search.scss';


/**
 * Is called when an error occurs. Can be overriden by your own business logic.
 *
 * @callback OnErrorCallback
 * @param {type} request The request.
 * @param {type} status The status.
 * @param {type} error The error.
 * @param {ol.Layer} layer The layer.
 * @param {ol.Map} map The map.
 */

/**
 * Is called when the user hovers over a search result in the ajax serach field.
 *
 * @callback OnHoverCallback
 * @param {string} suggestion The suggestion.
 * @param {ol.layer.Vector} layer The layer on which the search results will be drawn.
 * @param {ol.Map} map The map.
 * @param {ol.format.GeoJSON} geoJsonFormat The GeoJsonFormat parser.
 */

/**
 * Is called when a search result is selected.
 *
 * @callback OnSelectCallback
 * @param {string} suggestion The sugestion.
 * @param {ol.layer.Vector} layer The layer on which the search results will be drawn.
 * @param {ol.Map} map The map.
 * @param {ol.format.GeoJSON} geoJsonFormat The GeoJsonFormat parser.
 */

/**
 * Is called when the search results are returned. Can be overridden by your specific code.
 *
 * @callback OnShowCallback
 * @param {Object.<string, ol.vector.Feature>} suggestions The suggestions as key value pair (html, feature).
 * @param {ol.layer.Vector} layer The layer on which the search results will be drawn.
 * @param {ol.Map} map The map.
 * @param {ol.format.GeoJSON} geoJsonFormat The GeoJsonFormat parser.
 */

/**
 * Return value or default value
 */
function valueOrDefault(value, defaultValue) {
  return (value === undefined || value === null)
    ? defaultValue
    : value;
}

/**
 * @type {module:webgis4u/ol/control/Search~OnShowCallback}
 */
function defaultOnShow(suggestions, layer, map, geoJsonFormat) {
  layer.getSource().clear();

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < suggestions.length; i++) {
    layer.getSource().addFeature(
      geoJsonFormat.readFeature(
        suggestions[i].data, {
          featureProjection: map.getView().getProjection(),
        },
      ),
    );
  }
  zoomToLayerExtent(layer, map);
}

/**
 * @type {module:webgis4u/ol/control/Search~OnHoverCallback}
 */
function defaultOnHover(suggestion, layer, map, geoJsonFormat) {
  layer.getSource().clear();
  layer.getSource().addFeature(
    geoJsonFormat.readFeature(
      suggestion.data, {
        featureProjection: map.getView().getProjection(),
      },
    ),
  );
}

/**
 * @type {module:webgis4u/ol/control/Search~OnSelectCallback}
 */
function defaultOnSelect(suggestion, layer, map, geoJsonFormat) {
  const layeyrSource = layer.getSource();
  layeyrSource.clear();
  layeyrSource.addFeature(
    geoJsonFormat.readFeature(
      suggestion.data, {
        featureProjection: map.getView().getProjection(),
      },
    ),
  );
  zoomToLayerExtent(layer, map);
}

/**
 * @type {module:webgis4u/ol/control/Search~OnErrorCallback}
 */
function defaultOnError(request, status, error, layer) {
  layer.getSource().clear();
  if (status === 'timeout') {
    // timeout -> reload the page and try again
    console.log('timeout');
  } else {
    // another error occured
    console.log('error: ', request, status, error);
  }
}

/**
 * The default name used for the search field
 */
const HTML_NAME_SEARCH_FIELD = 'webgisSearchField';

/**
 * Provides google like search capability for the map.
 * The service is always application specific and must therefore be provided
 * by the application that uses the webgis client.
 *
 *  @example //for  search response format (= just an empty array)
 * [
  *   {
  *     "value": "display value 1",
  *     "data": {"type":"Feature","geometry":{"type":"Point","coordinates":[1187555.69,6019550.63]},"properties":{"lid":"layer0","fid":"fid0"}}
  *   },
  *   {
  *     "value": "display value 2",
  *     "data": {"type":"Feature","geometry":{"type":"Point","coordinates":[13555.69,6015650.63]},"properties":{"lid":"layer0","fid":"fid1"}}
  *   },
  *   {
  *     "value": "display value n",
  *     "data": {"type":"Feature","geometry":{"type":"Point","coordinates":[1087555.69,5419550.63]},"properties":{"lid":"layer1","fid":"fidn"}}
  *   }
  * ]
  *
  **/
class Search extends Control {
  /**
   * The dfeault nothing found message for the search control. Can be overriden with an individual message.
   */
  static MESSAGE_NOTHING_FOUND = 'Leider nichts gefunden';

  /**
   * The dfeault nothing found message for the search control. Can be overriden with an individual message.
   */
  static MESSAGE_PENDING = 'Bitte um Geduld...';

  /**
   * The style to show all search results.
   */
  static showStyle = getIconStyle({
    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAcCAYAAAB75n/uAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABcSAAAXEgFnn9JSAAAAB3RJTUUH3wgNBhwsPYTaSgAABMJJREFUSMellmlsVVUQx39z3r3vdXlQaMsDSgGB1hQDkSBbQAVKCZgYI0EssnxDEhJJCInGGDWoCR8gAaNgFCFEGmNYhBhRthKLoiIESlkkSE2U8oQ2QIXSvuX2nvFDufCAilT+n+49Z+Y/Z5bMjHAXrLUYYwBQ1TygBJgCjAX6AQZoAmqBPcBvItJ0Ux4R4V+hqpnfy1X1D/1vXFTVKlXNvZsDQDoxMhDYB5R2eATXWzwS6TSXGn18H3rHDDlZLnnRCI57SzWpqtONMQfuMRC4pqrPAl8AUYCTpxN8uuMH6uNxGq+04GsKEQUbprBHlAG9Y8yaMp7p5YWZnG+LyHsBpwQxV9UBwBkgB2DVurNs2L2D7lGDIggQMoqgtFuDKohAIuXzVNlEVr81DsfpeC/woohsU9XbIVLV80B/gNdW1vDd8UOEQiESaZdpZX8yccgFYtE2jEBzIsLh833YfmIIIaNYm6akz6N8sux5undzAJJAsYhcCUK0AngVYPXGOqr27iTihsnPSbJmZg2DCpvBmjuTZSyJVISFW8qpv9wD31rGlY3kgzenBhI/i8h4o6o9gRcAjv96hc/37sZ1IsSiCTa+tI9BhX/fSw5gDdmux4bZ1QzvewUIUVN3mK3f/h5IjFHVUQYYBAyyFrZWH8F1DQKsr6wmFm0De5+6BsIhn3WV1UQcS052mE279pNMKkAImGaACoBk2uNkfQMAk0sbKMxN8MAQZcnTtfjWcL2tjXPnm4KbkQYYCeB5Pg2XmgEY1b+poxwfFFYY0a+J3LBHMpWm8eq1Owz0Bmi6msDiIUBxXgtdRTTikRv2AIg33tLvbwAPwJiMNkHXIXK7LZjQrbylDdAAUNAzG9dxUCB+LdplA61plxtpFwT6xXKD43MG+Akg4jgM7JsPQG08hlXpUpKPx3vRmnbJjoTpW5gX3NQa4HvAz4o4jCgrBqCmvpi/ruWC0QciT3sOaw4+TkgsBXm5lAzoFUT6iFHVBuCkiDDnmVF47T7tvmHBlgpak+FO+u3d88Ow6MtybqRcWpMpFs+ehOuEAHzgK2OMSQLvAwwp7sUrlZNo99u5lojw8uYKmtuyoLOSFWi3hnf2jOPUxQJQy4zJI5g0ujSQ+EhELmQ2uy3ALIBVVfvZvPcoYCjq3krVvN1EI2nIyItVYdG2co5diGHwGVZSxNo3KskKuwAnUqnUiKysLDUZU2gucBpg6fwpVIwtQ9XnYksO86qmc/lGTocnAun2EK/vfJK6eCEGn6GD+7Bh2byAvBmY67qudjZwegPHgCKAtZsPsOnrX0A6PPlszh66Z6VZuKWC2ngvDD5jhj3CyqUzAnIPGC0idbcGzt3D3vM8x3GcMzeHPcs+/oZdB08jRoiGPQbmt3D6Uj5qlccG92Xju/MDimZggoicyVwcpLONQlVjwKGbnZb1O35k3baDmJBBVQDLxCdKWb74OZxQKBgwY0XkRCY5N1eQ2z/GYK1FRJpEZDBwDmDBjAnMnDqyo7LVMnxIESuWzAjIr6pqaWfk96ltG1RWgaqeCvaT7dWn9MNNR9WqDY6uq+rwTJ3/BVU928k+dNlam/9Q5IGitbabqh7JJFfVoQ/98k48OayqcWtttwcl/wcvK3cfKPPxaAAAAABJRU5ErkJggg==',
    anchorX: 0.5,
    anchorY: 0,
    opacity: 0.8,
  });

  /**
   * The style to show a single search result on hover.
   */
  static hoverStyle = getIconStyle({
    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAcCAMAAABMOI/cAAACiFBMVEUAAADr6+v7+/v8/Pz9/f3+/v7////+/v7////9/f39/f3////+/v7////+/v7+/v7+/v7////////////+/v7////+/v7////+/v7////+/v7////////////+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAP8AAf4BAf0BAv0CA/sCA/wDBPsDBfkDBvgEBvcEBvgECPYFCfQGCvIIDO8IDPALEugNFuMOFuMOF+IOF+MTINcUIdUVI9MVJNMaK8kbK8khN7sjOrcjO7UkO7UnPrEpQqwqRKoqRKsqUoIsSKQsSqIsSqMsU4MtSqItSqMtS6EvTp0vVYQvVoUwT5wwUZowV4YxUZkxV4YxWIYyWYYzVZUzWYc0VpM0WYg0Woc1Wog1W4g2W4k2W403W4w3W403XIs4XIs4XYk4XYo4XYs4Xok5XYo5Xog5Xok5Xoo5Xos5X4g5X4k6YYZCZZBNbpZPcJhSc5pVdJtXdpxffaFgfqJkgaRohadqhqhsiKltiKlwi6txjKx0jq16k7F8lLJ9lbN/l7SAmLSBmbWCmraHnbiJn7qNoryPpL2Rpr6Up8CVqcCdr8W1wtO1w9TEz9zI0t/N1uLR2eTT2+XU3ObV3ebc4+ve5Ozh5+7k6e/r7/Ps7/Tt8fXz9fj09vj19/n4+vv5+vv7/P39/f79/v7+/v7///9rT0BHAAAAUXRSTlMAAAAAAAAACwsMDQ0PEBIUFRUYGx4eIiUoKCosLTAxODo7PkdJUFVgbm91f4WGlpecnaOlrLC5v8DEys3Q1dzg5OXm6Onr7O3u7/Dx9vr7/P6ILloSAAAB4ElEQVR4AVWR93tMXRSF9/eJKFGIKEQvondCEpJIQkaUucpI9N57F4xiSJi5hnGQ4Yree+8E0aOX998xd557zeT97ay1zl7POVtMYkXi2/dIychM7dWhgXm0qCpxfbOxyO0fHxIsWowAvlZ8/PDpyx8Y3c7OJznh/c3Tx9xuder6a6CrxJgDmwPPtigV8PsDSnkegbOj2RPngNtFweDS+XNmzVsSMHZe+c7I2iLSG5541I6pWhjXRuV9AANF6mdQvsvYPFmzcK01NrxkTKK05dcNtW+K9o9xh9QZ6CLd+XZSLRurRVhknHhHHxnA5+1qgRbFTP+RMtIklTduNTvamF7se06OpFDuVnOjjRnFvhdkSj8qPGph5VFHy0iWzmb58ujyxWZ5T0nk9y21f1pEn3jg4FmcSVJtMG89x7fl2/qEwpI1rxhVR6QTPC5Smwqs560I6vehm4RIhju6sS4/nF9VuufiD1LCe62eDpd0tXWSpo1fqfRz4GgSaxrSNBvu6sb6AtfqUu/ln+S1FouaWXDNp3YXKu95yGsmFjHSOBPu+Q6X6FfB0cZcn02NrNDve/degNxG8r9I5E7DdHj6EIa3svO2U2sowLAEqSJS2ak3BHJaRudtp+6gtAT5Tyz+AuWT9uVwkiVIAAAAAElFTkSuQmCC',
    anchorX: 0.5,
    anchorY: 0,
    opacity: 0.5,
  });

  /**
   * The style to show a selected search result.
   */
  static selectStyle = Search.showStyle;

  /**
   * The default search URL. Can be overridden with an individual value (defaults value is "/ugisSearch").
   * @example //for setting a different search URL
   * Search.url = "/myApplicationSpecificURL";
   */
  static URL = '/ugisSearch';

  /**
   * The number of potential hits (defaults value is 19).
   * @example //for setting a different search limit
   * Search.limit = 10;
   */
  static limit = 19;

  /**
   * The number af chars after which the search starts (Avoids unecessary traffic in the server). The default value is 3.
   * @example //for setting a different minLength
   * Search.minLength = 2;
   */
  static minLength = 3;

  /**
   * The timout in ms for a search request (default = 2000).
   */
  static timeout = 2000;

  /**
   * Preprocesses the query. It gets as input parameters the query string and the map and has to output a json array
   * @example // for setting a custom search response
   * Search.preprocessQuery = (query, map) => ({query, 'extent': map.getView().calculateExtent(map.getSize())});
   */
  static preprocessQuery = query => ({ query });


  /**
   * @type {module:webgis4u/ol/control/Search~OnErrorCallback}
   * Is called when an error occurs. Can be overriden by your own business logic.
   *
   * @example
   * Search.onError = (request, status, error, layer, map) => {
   *   layer.getSource().clear();
   *   if (status == "timeout") {
   *       // timeout -> reload the page and try again
   *       console.log("timeout");
   *   } else {
   *       // another error occured
   *       console.log("error: " + request + status + err);
   *   }
   * };
   */
  static onError = defaultOnError;

  /**
   * @type {module:webgis4u/ol/control/Search~OnHoverCallback}
   */
  static onHover = defaultOnHover;

  /**
   * @type {module:webgis4u/ol/control/Search~OnSelectCallback}
   *
   * @example
   * //Can be overridden with your code
   * Search.onSelect = (suggestion, layer, map, geoJsonFormat) => {
   *    layer.getSource().clear();
   *    layer.getSource().addFeature(feature);
   *    zoomToExtent(feature.getGeometry().getExtent(), map);
   * };
   */
  static onSelect = defaultOnSelect;

  /**
 * @type {module:webgis4u/ol/control/Search~OnShowCallback}
 */
  static onShow = defaultOnShow;

  /**
   * @type {ol.Map|null}
   */
  map_ = null;

  /**
   * @type {HTMLElement}
   */
  _mapEl = null;

  _searchField = null;

  _suggestions = null;

  /**
   * Parser with the default geojson projection EPSG:4326
   * @type {ol.format.GeoJSON}
   */
  _geoJsonFormat = new GeoJSON({ defaultProjection: proj.get('EPSG:4326') });

  /**
   * @type {ol.layer.Vector}
   */
  _searchOverlay;

  /**
   * @type {ol.layer.Vector}
   */
  _searchResult;

  /**
   * The selector for the search field
   * @type {string}
   */
  searchFieldSelector;

  /**
   * Constructor
   *
   * @param {object} [options]  The following properties are supported.
   * @param {int} [options.minLength] The length when a request to the datasource is triggered.
   * @param {int} [options.limit] The number of displayed hits.
   * @param {string} [options.url] The search URL.
   * @param {string} [options.preprocessQuery] The search preprocessing function.
   * @param {string} [options.searchField] The search Field as jQuery selector.
   * @param {string} [options.timeout] The timeout in ms for the search Ajax Request.
   */
  constructor(passedOptions) {
    const options = passedOptions || {};

    const element = document.createElement('div');

    super({
      element,
      target: options.target,
    });

    // Default values
    this.minLength = valueOrDefault(options.minLength, Search.minLength);
    this.limit = valueOrDefault(options.limit, Search.limit);
    this.searchURL = valueOrDefault(options.searchURL, Search.URL);
    this.timeout = valueOrDefault(options.timeout, Search.timeout);
    this.searchFieldSelector = valueOrDefault(options.searchField, `input[name="${HTML_NAME_SEARCH_FIELD}"]`);

    // Default functions
    this.preprocessQuery = valueOrDefault(options.preprocessQuery, Search.preprocessQuery);
    this.onError = valueOrDefault(options.onError, Search.onError);
    this.onHover = valueOrDefault(options.onHover, Search.onHover);
    this.onShow = valueOrDefault(options.onHover, Search.onShow);
    this.onSelect = valueOrDefault(options.onSelect, Search.onSelect);

    this.initLayers();
  }

  /**
   * Gets the search overlay layer. Which is a vector layer on which the search result is visualized.
   * @returns {ol.layer.Vector}
   * @example
   * mySerachOverlayLayer = mySearchControl.getSearchOverlay();

    */
  getSearchOverlay() { return this._searchOverlay; }

  /**
   * Gets the search result layer. Which is a vector layer on which the search result is visualized.
   * @returns {ol.layer.Vector}
   * @example
   * mySerachOverlayLayer = mySearchControl.getSearchOverlay();
   */
  getSearchResult() { return this._searchResult; }

  /**
   * @returns {any} The suggestions
   */
  getSuggestions() { return this._suggestions; }

  /**
   * Initialize the layers
   * @private
   */
  initLayers() {
    this._searchResult = new VectorLayer({
      map: this.map_,
      source: new VectorSource(),
      style: Search.selectStyle,
    });

    // Create the search result overlay
    this._searchOverlay = new VectorLayer({
      map: this.map_,
      source: new VectorSource(),
      style: Search.hoverStyle,
    });
  }

  /**
   *
   * @param {ol.Map} map
   */
  setMap(map) {
    this.clearSearchResults();

    /* unbind everything an cleanup */
    if (this.map_) {
      this.map_.removeLayer(this._searchResult);
      this.map_.removeLayer(this._searchOverlay);
    }

    super.setMap(map);

    this.map_ = map;
    // Nothing more to do if there is no map
    if (!map) { return; }

    // Find the new map target
    this._mapEl = map.getTargetElement();
    this._searchField = this._mapEl.parentElement().querySelector(this.searchFieldSelector);
    // Only proceed if the search field exists
    if (!this._searchField) { return; }

    this.initLayers();

    // TODO: REPLACE TYPEAHEAD IMPLEMENTATION
    this._searchField.addClass("typeahead");
    $(this._searchField).typeahead({
      highlight: false,
      hint: false,
      minLength: this.minLength,
    }, {
      name: 'ugisSearch',
      display: result => result.value,
      //  workaround due to typeahead bug limit: options.limit
      limit: 'Infinity',
      source: debounce(() => this.getTypeAheadSource(this.searchURL, map), this.limit),
      async: true,
      templates: {
        notFound: Search.MESSAGE_NOTHING_FOUND,
        pending: Search.MESSAGE_PENDING,
      },
    },
    /* highlight and zoom to and clear the other selection */
    ).bind('typeahead:select', (ev, suggestion) => {
      this._searchOverlay.getSource().clear();
      this.onSelect(suggestion, this._searchResult, map, this._geoJsonFormat);
    }).bind('typeahead:cursorchange', (ev, suggestion) => {
      this.onHover(suggestion, this._searchOverlay, map, this._geoJsonFormat);
    });
  }

  /**
   * Gets a typeahead source based on the URL.
   * @param {type} url the datasource url.
   * @param {type} map the map.
   *
   * @private
   */
  getTypeAheadSource(url, map) {
    return (query, syncCallback, asyncCallback) => {
      sendRequest({
        url,
        type: 'GET',
        data: this.preprocessQuery(query, map),
        timeout: this.timeout,
        success: (json) => {
          asyncCallback(json);
          this.showSearchResults(json);
        },
        error: (xhr, status, error) => this.onError(xhr, status, error, layer, map),
      });
    };
  }

  /**
   * Clears the search results
   * @private
   */
  clearSearchResults() {
    // clear all existing search results.
    this._searchOverlay.getSource().clear();
    this._searchResult.getSource().clear();
  }

  /**
   * shows the search resuls.
   * @private
   */
  showSearchResults(suggestions) {
    this.clearSearchResults();

    // Get the elements from this
    const {
      _searchOverlay,
      _searchResult,
      map_,
      _mapEl,
      _geoJsonFormat,
    } = this;

    const mapParent = _mapEl.parentElement;
    // Style the menu
    const typeAheadMenu = mapParent.querySelector('.tt-menu');
    typeAheadMenu.style['z-index'] = 2000;

    // Handle the elements
    const suggestionEntries = mapParent.querySelectorAll('.tt-suggestion');
    suggestionEntries.forEach((element, i) => {
      if (i > this.limit) { return; }

      element.addEventListener('mouseover', () => {
        this.onHover(suggestions[i], _searchOverlay, map_, _geoJsonFormat);
      });
    });

    this.onShow(suggestions, _searchResult, map_, _geoJsonFormat);
  }
}

export default Search;

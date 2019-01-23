/**
 * @module webgis4u/ol/control/util
 */

import Collection from 'ol/Collection';
import * as coordinate from 'ol/coordinate';
import MousePosition from 'ol/control/MousePosition';
import Zoom from 'ol/control/Zoom';
import ZoomSlider from 'ol/control/ZoomSlider';

import HtmlTemplate from './HtmlTemplate';
import OverviewMap from './OverviewMap';
import PanBar from './PanBar';
import ScaleLine from './ScaleLine';
import Search from './Search';

/**
 * @typdef DefaultsOptions
 * @type {object}
 * @property {boolean} [zoom=true] If true, the zoom control is included
 * @property {object} [zoomOptions] Options for the zoom control
 *
 * @property {boolean} [zoomSlider=true] If true, the zoom slider control is included
 * @property {object} [zoomSliderOptions] Options for the zoom slider control
 *
 * @property {boolean} [mousePosition=true] If true, the mouse position control is included
 * @property {object} [mousePositionOptions] Options for the mouse position control
 *
 * @property {boolean} [panBar=true] If true, the pan bar control is included
 * @property {object} [panBarOptions] Options for the pan bar control
 *
 * @property {boolean} [scaleLine=true] If true, the scale line control is included
 * @property {object} [scaleLineOptions] Options for the scale line control
 *
 * @property {boolean} [overviewMap=true] If true, the overview map control is included
 * @property {object} [overviewMapOptions] Options for the overview map control
 *
 * @property {boolean} [search=true] If true, the search control is included
 * @property {object} [searchOptions] Options for the search control
 *
 * @property {boolean} [htmlTemplate=true] If true, the html template is included
 * @property {object} [htmlTemplateOptions] Options for the html template control
 */

/**
 * @param {module:webgis4u/ol/control/util~DefaultsOptions} [passedOptions]
 */
export function defaults(passedOptions) {
  const options = passedOptions || {};
  const controls = new Collection();

  // Zoom
  const zoomControl = !(options.zoom === false);
  if (zoomControl) {
    controls.push(new Zoom(options.zoomOptions));
  }

  // Mouse Position
  const mousePosition = !(options.mousePosition === false);
  if (mousePosition) {
    controls.push(new MousePosition({
      coordinateFormat: coord => coordinate.format(coord, '{x}&deg;O {y}&deg;N', 5),
      projection: 'EPSG:4326',
      undefinedHTML: '&nbsp;',
      ...options.mousePositionOptions,
    }));
  }

  // ZoomSlider
  const zoomSliderControl = !(options.zoomSlider === false);
  if (zoomSliderControl) {
    controls.push(new ZoomSlider(options.zoomSliderOptions));
  }

  // PanBar
  const panBarControl = !(options.panBar === false);
  if (panBarControl) {
    controls.push(new PanBar(options.panBarOptions));
  }

  // ScaleLine
  const scaleLineControl = !(options.scaleLine === false);
  if (scaleLineControl) {
    controls.push(new ScaleLine(options.scaleLineOptions));
  }

  // OverviewMap
  const overviewMapControl = !(options.overviewMap === false);
  if (overviewMapControl) {
    controls.push(new OverviewMap(options.overviewMapOptions));
  }

  // Search
  const searchControl = !(options.search === false);
  if (searchControl) {
    controls.push(new Search(options.searchOptions));
  }

  // Search
  const htmlTemplateControl = !(options.htmlTemplate === false);
  if (htmlTemplateControl) {
    controls.push(new HtmlTemplate(options.htmlTemplateOptions));
  }

  return controls;
}

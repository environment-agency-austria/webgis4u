/**
 * @module webgis4u/ol/control/HtmlTemplate
 */

import Control from 'ol/control/Control';

import { toggleElement } from '../../util/dom/toggleElement';

import {
  OL_CONTROL_ZOOM_CSS_CLASS_MOUSE_POSITION,
  OL_CONTROL_ZOOM_CSS_CLASS_ZOOM,
  OL_CONTROL_ZOOM_CSS_CLASS_ZOOMSLIDER,
} from './common';

import { CSS_CLASS as PanBarCssClass } from './PanBar';
import { CSS_CLASS as ScaleLineCssClass } from './ScaleLine';

import ToolSwitcher from './HtmlTemplate/ToolSwitcher/ToolSwitcher';
import InfoPanel from './HtmlTemplate/InfoPanel/InfoPanel';

import './HtmlTemplate/HtmlTemplate.scss';
import { createElement } from '../../util/dom/createElement';
import { getMapType, MapTypeEnum } from '../util/getMapType';

const MIN_NAVBAR_DISPLAYHEIGHT = 100;
const MIN_NAVBAR_DISPLAYWIDTH = 100;
const MIN_MAPFOOTER_DISPLAYHEIGHT = 1000;

/**
 * Toggles element visibility if the element exists
 * @param {HTMLElement|undefined} element
 * @param {boolean|undefined} toggle
 */
function secureToggleElement(element, toggle) {
  if (element) { toggleElement(element, toggle); }
}

/**
 * Glues the map template with the map together.
 *
 * @extends {ol.control.Control}
 */
class HtmlTempalte extends Control {
  /** @type {HTMLElement} */
  mapEl;

  /** @type {HTMLElement|null} */
  scaleLineCheckbox = null;

  /** @type {HTMLElement|null} */
  scaleLine = null;

  /** @type {HTMLElement|null} */
  scaleSlider = null;

  /** @type {HTMLElement|null} */
  panBar = null;

  /** @type {HTMLElement|null} */
  mousePosCheckbox = null;

  /** @type {HTMLElement|null} */
  mousePos = null;

  /** @type {HTMLElement|null} */
  mapCopyright = null;

  /** @type {HTMLElement} */
  mapFooter = null;

  infoPanel = new InfoPanel();

  toolSwitcher = new ToolSwitcher();

  /**
   * Constructor
   * @param {*} options The options
   */
  constructor(options) {
    /* creates the dom element */
    const element = document.createElement('div');
    const elementFooter = createElement({ tag: 'div', cssClass: 'webgis4u-map-footer' });
    element.appendChild(elementFooter);

    /**
     * initialize the parent control.
     */
    super({
      element,
      ...options,
    });

    this.mapFooter = elementFooter;
  }

  /**
   * @inheritDoc
   */
  setMap(map) {
    super.setMap(map);

    // If no map is present there is nothin more to do
    if (!map) { return; }

    /**
     * @type {HTMLElement}
     */
    const mapEl = map.getTargetElement();
    this.mapEl = mapEl;

    // Find map elements
    this.mousePosCheckbox = mapEl.querySelector('input[name="webgis4uDisplayMousePosition"]');
    this.scaleLineCheckbox = mapEl.querySelector('input[name="webgis4uScaleLine"]');

    // Find the map controls
    // Find the webgis4u controls
    this.scaleLine = mapEl.querySelector(`.${ScaleLineCssClass}`);
    this.panBar = mapEl.querySelector(`.${PanBarCssClass}`);
    // Find the OL controls
    this.mousePos = mapEl.querySelector(`.${OL_CONTROL_ZOOM_CSS_CLASS_MOUSE_POSITION}`);
    this.zoom = mapEl.querySelector(`.${OL_CONTROL_ZOOM_CSS_CLASS_ZOOM}`);
    this.scaleSlider = mapEl.querySelector(`.${OL_CONTROL_ZOOM_CSS_CLASS_ZOOMSLIDER}`);

    // Find map elements
    this.mapCopyright = mapEl.querySelector('.ugis-map-copyright');

    // enable display / not display mouse position
    if (this.mousePosCheckbox && this.mousePos) {
      this.mousePosCheckbox.onchange = (e => toggleElement(this.mousePos, e.target.checked));
    }

    // enable display / not display scale line
    if (this.scaleLineCheckbox && this.scaleLine) {
      this.scaleLineCheckbox.onchange = (e => toggleElement(this.scaleLine, e.target.checked));
    }

    this.toolSwitcher.init(mapEl);
    this.infoPanel.init(map);

    /* display or hide controls based on the available map size */
    window.addEventListener('resize', this.updateControlsVisibility);
    this.updateControlsVisibility();
  }

  /**
   * Updates the visibility for the controls
   * @private
   */
  updateControlsVisibility = () => {
    const map = this.getMap();

    // do it only for the large map
    if (!map || getMapType(map) !== MapTypeEnum.Large) { return; }

    const size = map.getSize();
    if (!size) { return; }

    const [width, height] = size;

    const toggle = (height > MIN_NAVBAR_DISPLAYHEIGHT && width > MIN_NAVBAR_DISPLAYWIDTH);
    secureToggleElement(this.scaleSlider, toggle);
    secureToggleElement(this.zoom, toggle);
    secureToggleElement(this.panBar, toggle);

    const toggle2 = (height < MIN_MAPFOOTER_DISPLAYHEIGHT);
    secureToggleElement(this.mapFooter, toggle2);
    secureToggleElement(this.mousePos, toggle2);
    secureToggleElement(this.scaleLine, toggle2);
    secureToggleElement(this.mapCopyright, toggle2);

    this.toolSwitcher.updateControlsVisibility({ size });
  }
}

export default HtmlTempalte;

/**
 * @module webgis4u/ol/control/HtmlTemplate/InfoPanel
 */

import './InfoPanel.scss';
import { getToggledAttribute, isElementToggled, toggleElement } from '../../../../util/dom/toggleElement';

export const CSS_CLASS = 'webgis4u-info-panel';
export const CSS_CLASS_CONTENT = `${CSS_CLASS}-content`;
export const CSS_CLASS_CONTROL = 'webgis4u-control-info';

/**
 * Class for orchestrating the info panel
 */
class InfoPanel {
  /**
   * @type {ol.Map}
   * @private
   */
  map;

  /**
   * @type {HTMLElement}
   * @private
   */
  mapTargetElement;

  /**
   * @type {HTMLElement|null}
   * @private
   */
  panel = null;

  /**
   * @type {HTMLElement|null}
   * @private
   */
  panelContent = null;

  /**
   * @type {HTMLElement|null}
   * @private
   */
  toggleButton = null;

  /**
   * Initialize the info panel
   * @param {ol.Map} map The map
   */
  init(map) {
    this.map = map;
    this.mapTargetElement = map.getTargetElement();
    const mapWrapper = this.mapTargetElement.parentNode;

    // needed for large map info panel
    this.panel = mapWrapper.querySelector(`.${CSS_CLASS}`);
    this.panelContent = mapWrapper.querySelector(`.${CSS_CLASS_CONTENT}`);
    this.toggleButton = mapWrapper.querySelector(`.${CSS_CLASS_CONTROL}`);

    // initialize the info panel interaction
    if (!this.panel || !this.panelContent || !this.toggleButton) { return; }

    const initialToggledValue = getToggledAttribute(this.panel);
    this.toggleInfo((initialToggledValue !== undefined ? initialToggledValue : true));
    this.toggleButton.onclick = () => {
      this.toggleInfo(!this.isInfoShown());
      return false;
    };
  }

  /**
   * @returns {boolean} `true` if the panel is shown
   * @private
   */
  isInfoShown() {
    return isElementToggled(this.panel);
  }

  /**
   * Toggled the panel
   * @param {boolean} toggle
   * @private
   */
  toggleInfo(toggle) {
    toggleElement(this.panel, toggle);
    this.map.updateSize();
  }
}

export default InfoPanel;

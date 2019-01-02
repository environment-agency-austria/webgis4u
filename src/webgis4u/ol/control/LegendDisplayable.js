/**
 * @module webgis4u/ol/control/LegendDisplayable
 */

import { createElement } from '../../util/dom/createElement';
import AbstractLayerRelatedControl from './AbstractLayerRelatedControl';

/**
 * @typedef LegendDisplayableOptions
 * @type {module:webgis4u/ol/control/AbstractLayerRelatedControl~LayerRelatedControlOptions}
 * @property {string} styleValueVisible The value when the layer is visible
 * @property {string} styleValueHidden The value when the layer is not visible
 */

/**
 * Control to control layer visibility
 *
 * @extends {module:webgis4u/ol/control/AbstractLayerRelatedControl~AbstractLayerRelatedControl}
 */
class LegendDisplayable extends AbstractLayerRelatedControl {
  /**
   * The value used as display style when the layer is visible
   * @type {object}
   * @private
   */
  styleIsDisplayable = {
    opacity: 1,
    title: '',
  };

  /**
   * The value used as display style when the layer is not visible
   * @type {object}
   * @private
   */
  styleIsNotDisplayable = {
    opacity: 0.6,
    title: 'Wird in diesem Maßstab nicht angezeigt.',
  };

  /**
   * @returns {ol.View|null} The map view
   * @private
   */
  get mapView() {
    const map = this.getMap();
    if (!map) { return null; }

    return map.getView();
  }

  /**
   * Creates a new control that connects layer visiblity with HTML elements
   *
   * @param {LegendDisplayableOptions} options
   * The options
   */
  constructor(options) {
    const element = createElement({ tag: 'div' });

    const {
      controlOptions,
      layerMapOptions,
      ...otherOptions
    } = options;

    super({
      layerMapOptions,
      controlOptions: {
        ...controlOptions,
        element,
      },
    });

    if (otherOptions.styleIsDisplayable) {
      this.styleIsDisplayable = otherOptions.styleIsDisplayable;
    }
    if (otherOptions.styleIsNotDisplayable) {
      this.styleIsNotDisplayable = otherOptions.styleIsNotDisplayable;
    }
  }

  /**
   * @inheritdoc
   */
  registerListener(o) {
    const { listener } = o;
    const view = this.mapView;
    view.on('change:resolution', listener);
  }

  /**
   * @inheritdoc
   */
  unregisterListener(o) {
    const { listener } = o;
    const view = this.mapView;
    view.un('change:resolution', listener, false);
  }

  /**
   * @inheritdoc
   */
  onLayerInteractionAdded(options) {
    this.updateLayerStyle(options);
  }

  /**
   * @inheritdoc
   */
  handleLayerInteraction(e) {
    this.updateLayerStyle(e);
  }

  /**
   * Updates the layer style
   * @private
   */
  updateLayerStyle(options) {
    const { element, layer } = options;
    const view = this.mapView;

    // Do nothing if no element and no view are available
    if (!element || !view) { return; }

    this.setIsDisplayable(element, this.isLayerAvailable(layer, view));
  }

  /**
   * Sets the style to be like when the corresponding layer is displayable or not
   *
   * @param {HTMLElement} element The element
   * @param {boolean} isDisplayable If true, the layer is displayable
   *
   * @private
   */
  setIsDisplayable(element, isDisplayable) {
    const options = isDisplayable
      ? this.styleIsDisplayable
      : this.styleIsNotDisplayable;

    this.updateElementStyle(element, options);
  }

  /**
   * Updates the style
   * @private
   */
  updateElementStyle(element, options) {
    const e = element;
    const {
      opacity,
      title,
    } = options;
    e.style.opacity = opacity;
    e.title = title;
  }

  /**
   * @returns {boolean} TRUE, if the layer is available for this view resolution
   * @private
   */
  isLayerAvailable(layer, view) {
    const viewR = view.getResolution();
    return (
      (layer.getMinResolution() <= viewR)
      && (viewR <= layer.getMaxResolution())
    );
  }
}

export default LegendDisplayable;

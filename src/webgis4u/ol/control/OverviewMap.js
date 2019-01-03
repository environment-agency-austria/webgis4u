/**
 * @module webgis4u/ol/control/OverviewMap
 */

import Control from 'ol/control/Control';
import LineString from 'ol/geom/LineString';
import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import ImageStatic from 'ol/source/ImageStatic';
import Vector from 'ol/source/Vector';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import * as proj from 'ol/proj';
import * as extent from 'ol/extent';


import { createElement } from '../../util/dom/createElement';
import { getMapChildElementByClassName } from '../../util/ol/getMapChildElementByClassName';
import { EPSG31287_ID } from '../proj/epsg31287';

import { CSS_CONTROL_PREFIX } from './common';
import './OverviewMap/OverviewMap.scss';

/**
 * @typedef CreateOverviewMapOptions
 * @type {object}
 * @property {*} target The target for the map
 * @property {ol.layer.ImageLayer} imageLayer The layer with the image
 * @property {ol.source.ImageStatic} imageSource The source image used for the layer
 */

/**
 * Style used for the feature overlay
 */
const defaultStyle = new Style({
  stroke: new Stroke({
    color: '#000000',
    width: 1,
  }),
});

/**
 * Control offering navigation via an overview map
 */
class OverviewMap extends Control {
  rootClass = `${CSS_CONTROL_PREFIX}-overviewmap`;

  extent = [99E3, 279E3, 695E3, 582E3];

  projection = proj.get(EPSG31287_ID);

  /**
   * The map that shows the overview.
   * If non is present, the value is `null`.
   * @type {ol.Map|null}
   */
  overviewMap = null;

  /**
   * The previous map
   * @type {ol.Map}
   * @private
   */
  oldMap = null;

  /**
   * The target that was passed to the control
   * @type {HTMLElement|string|undefined}
   */
  controlTarget = undefined;

  /**
   * Creates a new abstract layer related control
   *
   * @param {LayerRelatedControlOptions} options
   * The options
   */
  constructor(options) {
    const imageSize = [166, 86];
    const element = createElement({
      tag: 'div',
      width: `${imageSize[0]}px`,
      height: `${imageSize[1]}px`,
    });

    const { target } = options || {};

    super({
      element,
      target,
    });

    this.controlTarget = target;
    this.imageSize = imageSize;

    // Create the image layer
    this.imageLayer = new ImageLayer({
      source: new ImageStatic({
        imageExtent: this.extent,
        size: imageSize,
        projection: this.projection,
        url: '',
        imageLoadFunction: (image) => {
          // eslint-disable-next-line no-param-reassign
          image.getImage().src = 'data:image/png;base64,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';
        },
      }),
    });
  }

  /**
   * @returns {ol.Map|null} `null` if no map is present. Otherwise the map will be returned
   */
  getOverviewMap() {
    return this.overviewMap;
  }

  /**
   * Creates the overview map from the given options
   * @param {CreateOverviewMapOptions} options The options
   *
   * @returns {ol.Map} The overview map
   */
  createOverviewMap(options) {
    const {
      target, imageLayer,
      imageSource,
      imageSize,
    } = options;

    const imageExtent = imageSource.getImageExtent();
    const projection = imageSource.getProjection();

    const resolution = (imageExtent[2] - imageExtent[0]) / imageSize[0];
    const center = extent.getCenter(imageExtent);

    const m = new Map({
      controls: [],
      interactions: [],
      layers: [imageLayer],
      target,
      view: new View({
        projection,
        resolution,
        center,
      }),
    });

    m.on('click', this.centerMap);

    return m;
  }

  /**
   * Disposes the overview map
   */
  disposeOverviewMap() {
    if (!this.overviewMap) { return; }

    this.overviewMap.removeOverlay(this.featureOverlay);
    this.overviewMap.un('click', this.centerMap);
    this.overviewMap = null;
  }

  /**
   * @inheritdoc
   */
  setMap(map) {
    if (this.oldMap) {
      this.oldMap_.getView().un('propertychange', this.handleViewPropertyChanged);
      this.element.innerText = '';
    }
    this.disposeOverviewMap();

    // Update new map
    this.oldMap = map;
    super.setMap(map);

    // Add new interactions if map is available
    if (!map) { return; }
    const view = map.getView();

    const overviewMapDiv = this.controlTarget
      || getMapChildElementByClassName({ map, className: this.rootClass });

    // Create the overview map
    this.overviewMap = this.createOverviewMap({
      target: this.element,
      imageLayer: this.imageLayer,
      imageSource: this.imageLayer.get('source'),
      imageSize: this.imageSize,
    });

    // Empty the 'target' and append the element
    overviewMapDiv.innerText = '';
    overviewMapDiv.appendChild(this.element);

    this.featureOverlay = new VectorLayer({
      map: this.overviewMap,
      source: new Vector({}),
      style: defaultStyle,
    });

    // Register the event handler and render initial
    view.on('propertychange', this.handleViewPropertyChanged);
    this.renderCrossHair();
  }

  /**
   * Renders the cross hair at the center from the current map
   */
  renderCrossHair() {
    // Get local variables
    const map = this.getMap();
    const view = map.getView();

    // Get extent and center
    const [left, top, right, bottom] = this.extent;
    const [centerX, centerY] = proj.transform(
      view.getCenter(),
      view.getProjection(),
      this.projection,
    );

    // Create the lines
    const lineVertical = new LineString([[centerX, top], [centerX, bottom]]);
    const lineHorizontal = new LineString([[left, centerY], [right, centerY]]);

    // Clear features and add new ones
    const foSource = this.featureOverlay.getSource();
    foSource.clear();
    foSource.addFeatures([
      new Feature({
        id: 'v',
        geometry: lineVertical,
      }),
      new Feature({
        id: 'h',
        geometry: lineHorizontal,
      }),
    ]);
  }

  /**
   * Center the original map according to the click on the overview map
   */
  centerMap = (event) => {
    const view = this.getMap().getView();
    const {
      coordinate, map,
    } = event;

    // Get the projection from the overview map view
    const overviewMapProjection = map.getView().getProjection();

    view.setCenter(proj.transform(coordinate, overviewMapProjection, view.getProjection()));
  }

  handleViewPropertyChanged = () => {
    this.renderCrossHair();
    return false;
  }
}

export default OverviewMap;

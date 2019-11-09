/**
 * @module webgis4u/ol/control/Measure
 */

import Control from 'ol/control/Control';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import VectorLayer from 'ol/layer/Vector';
import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';

import { createElement } from '../../util/dom/createElement';
import { formatUnitValue } from '../../util/string';
import { reproject } from '../proj/reproject';
import { MODIFY_FILL, MODIFY_STROKE, SELECT_STROKE, SELECT_FILL } from '../style/color';
import { getStyle } from '../style/style';

import { CSS_CONTROL_PREFIX } from './common';

import './Measure/Measure.scss';
import { EPSG31287_ID } from '../proj/austria';

/**
 * Enum describing the measurement type.
 * @readonly
 * @enum {string}
 */
export const MeasurementTypeEnum = {
  /** Area */
  Area: 'area',
  /** Distance */
  Distance: 'distance',
};

const DFEAULT_MEASUREMENT_TYPE = MeasurementTypeEnum.Distance;

/**
 * The CSS class for the contorl
 */
export const CSS_CLASS = `${CSS_CONTROL_PREFIX}-measure-output`;

/**
 * @param {MeasurementTypeEnum} measurementType The interaction type
 * @returns {ol.geom.GeometryType}
 */
function GetClassForType(measurementType) {
  switch (measurementType) {
    case MeasurementTypeEnum.Area: return 'Polygon';
    case MeasurementTypeEnum.Distance: return 'LineString';
    default: throw new Error('Unsupported type');
  }
}

/**
 * @param {MeasurementTypeEnum} value The value
 * @returns {MeasurementTypeEnum} The passed value or the default type
 */
function getMeasurementTypeOrDefault(value) {
  const keys = Object.keys(MeasurementTypeEnum);
  const result = keys.find(key => MeasurementTypeEnum[key] === value);

  return (result)
    ? value
    : DFEAULT_MEASUREMENT_TYPE;
}

/**
 * Control for measuring
 */
class Measure extends Control {
  /**
   * The limit above the distance is displayed in km (default < 1000). You can
   * override it with your individual value if necessary.
   * @type {integer}
   */
  static limit4m = 1000;

  /**
   * The limit when the area is displayed in km2 (default < 1000000). You can
   * override it with your individual value if necessary.
   * @type {integer}
   */
  static limit4m2 = 1000000;

  /**
   * The type
   * @type {string}
   */
  measurementType_ = DFEAULT_MEASUREMENT_TYPE;

  /**
   * The old map
   * @type {ol.Map|null}
   */
  oldMap_ = null;

  constructor(options) {
    const element = createElement({
      tag: 'div',
      cssClass: CSS_CLASS,
    });

    super({
      element,
      ...options,
    });

    const source = new VectorSource();
    this.vector = new VectorLayer({
      source,
      style: getStyle(3, 6, SELECT_STROKE, SELECT_FILL, this.lineDash),
    });

    const initialMeasurementType = options && options.type;
    this.measurementType_ = getMeasurementTypeOrDefault(initialMeasurementType);
  }

  /**
   * @returns {MeasurementTypeEnum} the current type
   */
  get measurementType() { return this.measurementType_; }

  /**
   * Sets a new type
   * @param {MeasurementTypeEnum} value The type
   */
  set measurementType(value) {
    this.measurementType_ = getMeasurementTypeOrDefault(value);
    this.addInteraction(this.measurementType_);
  }

  /**
   * @returns {MeasurementTypeEnum} the current type
   */
  getType() { return this.measurementType; }

  /**
   * Sets a new type
   * @param {MeasurementTypeEnum} value The type
   */
  setType(value) { this.measurementType = value; }

  /**
   * @inheritdoc
   */
  setMap(map) {
    // Clean up if an old map exists
    if (this.oldMap_) {
      /* remove all measure interactions (if any) */
      this.vector.getSource().clear();
      this.oldMap_.removeLayer(this.vector);
      this.oldMap_.removeInteraction(this.draw);
      this.oldMap_.un('pointermove', this.handleMeasurementShouldUpdate);

      this.toggleElement(false);
    }

    this.oldMap_ = map;
    if (map) {
      this.measurementType = this.measurementType;
      this.oldMap_.addLayer(this.vector);
      this.oldMap_.on('pointermove', this.handleMeasurementShouldUpdate);
    }

    super.setMap(map);
  }

  /**
   * Toggles the elements visibility
   * @param {boolean} isVisible If `true`, the element will be displayed
   *
   * @private
   */
  toggleElement(isVisible) {
    const { element } = this;

    if (!element) { return; }
    element.setAttribute('data-visible', isVisible);
  }

  handleMeasurementShouldUpdate = () => {
    this.updateMeasurement();
  }

  /**
   * Updates the measurement
   *
   * @private
   */
  updateMeasurement() {
    if (!this.sketch) { return; }
    const geom = this.sketch.getGeometry();
    if (!geom) { return; }

    const sourceProjection = this.oldMap_.getView().getProjection().getCode();
    const reprojected = reproject(geom, sourceProjection, EPSG31287_ID);

    let text = '';
    if (geom instanceof Polygon) {
      text = this.displayArea(reprojected.getArea());
    } else if (geom instanceof LineString) {
      text = this.displayLength(reprojected.getLength());
    }

    this.element.innerHTML = text;
  }

  /**
   * Add the interaction
   * @param {MeasurementTypeEnum} measurementType
   *
   * @private
   */
  addInteraction(measurementType) {
    const typeConstructor = GetClassForType(measurementType);

    this.draw = new Draw({
      source: this.source,
      type: typeConstructor,
      style: getStyle(3, 6, MODIFY_STROKE, MODIFY_FILL, this.lineDash),
    });

    this.oldMap_.addInteraction(this.draw);
    this.draw.on('drawstart', this.onDrawStart);
    this.draw.on('drawend', this.onDrawEnd);
  }

  /**
   * Event handler for the draw start event
   * @private
   */
  onDrawStart = (evt) => {
    // set sketch
    this.sketch = evt.feature;
    this.toggleElement(true);
  }

  /**
   * Event handler for the draw end event
   * @private
   */
  onDrawEnd = () => {
    // unset sketch
    this.sketch = null;
  }

  /**
   * Formats the length output.
   * @param {ol.geom.LineString} length The length in m
   * @return {string} The formated length.
   *
   * @private
   */
  displayLength(length) {
    const formatedUnitValue = formatUnitValue({
      value: length,
      decimals: 2,
      units: [
        { abbreviation: 'm' },
        { abbreviation: 'km', factor: 1000, limit: Measure.limit4m },
      ],
    });

    return `L&auml;nge: ${formatedUnitValue}`;
  }

  /**
   * Formats the area output.
   * @param {number} area The area.
   * @returns {string} The formated area.
   *
   * @private
   */
  displayArea(area) {
    const formatedUnitValue = formatUnitValue({
      value: area,
      decimals: 2,
      units: [
        { abbreviation: 'm<sup>2</sup>' },
        { abbreviation: 'km<sup>2</sup>', factor: 1000000, limit: Measure.limit4m2 },
      ],
    });

    return `Fl&auml;che: ${formatedUnitValue}`;
  }
}

export default Measure;

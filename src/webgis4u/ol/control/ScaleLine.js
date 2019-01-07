/**
 * @module webgis4u/ol/control/ScaleLine
 */

import Control from 'ol/control/Control';

import { createElement } from '../../util/dom/createElement';
import { convertUnitValue } from '../../util/number/convertUnitValue';
import { getScale } from '../util/getScale';
import { CSS_CONTROL_PREFIX } from './common';

import './ScaleLine/ScaleLine.scss';

/**
 * Units for the scale line (at this time only internal ).
 * @enum {string}
 */
export const ScaleLineUnitEnum = {
  METRIC: 'metric',
};


/**
 * The root CSS class
 * @type {string}
 */
export const CSS_CLASS = `${CSS_CONTROL_PREFIX}-scaleline`;
export const CSS_CLASS_SCALE = `${CSS_CONTROL_PREFIX}-scale`;
export const CSS_CLASS_SCALEBAR = `${CSS_CONTROL_PREFIX}-scalebar`;

/**
 * @const
 * @type {Array.<number>}
 */
const LEADING_DIGITS = [1, 2, 5];

/**
 *
 */
class ScaleLine extends Control {
  /**
   * If `true`, the scale is shown
   * @type {boolean}
   */
  static SHOW_SCALE = true;

  /**
   * @type {ScaleLineUnitEnum|undefined}
   * @private
   */
  units_ = ScaleLineUnitEnum.METRIC;

  /**
   * Stores the canvas
   * @type {HTMLCanvasElement|null}
   */
  canvas_ = null;

  /**
   * @type {number}
   */
  minWidth_ = 64;

  constructor(options) {
    const element = createElement({
      tag: 'div',
      cssClass: `${CSS_CLASS} noUbaTooltip`,
    });

    const canvas = createElement({
      tag: 'canvas',
      cssClass: CSS_CLASS_SCALEBAR,
    });
    element.appendChild(canvas);

    super({
      element,
      ...options,
    });

    this.canvas_ = canvas;
  }

  /**
   * @return {ScaleLineUnitEnum|undefined} The units to use in the scale line.
   */
  getUnits() { return this.units_; }

  /**
   * @param {ScaleLineUnitEnum} value The units to use in the scale line.
   */
  setUnits(value) { this.units_ = value; }

  /**
   * @return {HTMLCanvasElement|null} The canvas element
   */
  getCanvas() { return this.canvas_; }

  /**
   * @inheritdoc
   */
  setMap(map) {
    super.setMap(map);
    // Do nothing else if map is not set
    if (!map) { return; }

    map.getView().on('propertychange', this.updateElement);
    this.updateElement();
  }

  /**
   * Draws the scalbar in the canvas
   *
   * @param {object} options The draw options
   * @param {string} options.unit The unit.
   * @param {number} options.length The length.
   * @param {number} options.size The size in pixel.
   * @param {HTMLCanvasElement} options.canvas The canvas to draw on.
   *
   * @private
   */
  draw(options) {
    const { unit, length, size, canvas } = options;

    const height = 30;
    const fontSize = height / 3;
    const sp = 20;
    const st = 10;
    const sm = 14;
    const sb = 18;
    const bh = sb - sm;
    const tb = height;
    const ctx = canvas.getContext('2d');

    // first clear for redrawing
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = size + 2 * sp;
    canvas.height = height;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 2; i++) {
      ctx.moveTo(i * size + sp, st);
      ctx.lineTo(i * size + sp, sb);
    }
    ctx.strokeStyle = 'black';
    ctx.fillRect(sp, sm, size, bh);
    ctx.fillStyle = 'white';
    ctx.fillRect(sp, sm, size / 4, bh);
    ctx.fillRect(sp + size / 2, sm, size / 4, bh);
    ctx.rect(sp, sm, size, bh);
    ctx.fillStyle = 'fff';
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.font = '10px Arial';
    ctx.fillText(unit, sp + size / 2, fontSize);
    ctx.fillText('0', sp, tb);
    ctx.fillText(length / 2, sp + size / 2, tb);
    ctx.fillText(length, sp + size, tb);
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
    this.renderedVisible_ = isVisible;
  }

  /**
   * Updates the element
   *
   * @private
   */
  updateElement = () => {
    const viewState = this.getMap().getView();
    if (viewState === null) {
      if (this.renderedVisible_) {
        this.toggleElement(false);
      }
      return;
    }

    const units = this.units_;

    const scale = getScale(this.getMap());
    console.error('scale', scale);
    const { formated } = scale;
    let { resolution } = scale;
    const nominalCount = this.minWidth_ * resolution;// pointResolution;
    let unit = '';
    if (units === ScaleLineUnitEnum.METRIC) {
      const { unit: targetUnit } = convertUnitValue({
        value: nominalCount,
        units: [
          { abbreviation: 'mm', factor: 0.001 },
          { abbreviation: 'm', fallback: true },
          { abbreviation: 'km', factor: 1000 },
        ],
      });
      unit = targetUnit.abbreviation;
      resolution /= targetUnit.factor;
    } else {
      console.log('Invalid units in scale line');
    }

    let i = 3 * Math.floor(
      Math.log(this.minWidth_ * resolution) / Math.log(10),
    );
    let length;
    let size;

    // Calculate the scale to use
    do {
      length = LEADING_DIGITS[i % 3]
              * (10 ** Math.floor(i / 3));
      console.error('length', length);
      size = Math.round(length / resolution);
      console.error('size', size);

      if (Number.isNaN(size)) {
        this.toggleElement(false);
        return;
      }

      i += 1;
    } while (size < this.minWidth_);

    const html = length + unit;
    console.error('html', html);

    // draw the scalebar
    if (this.renderedHTML_ !== html) {
      this.element.setAttribute('title', `Ma${String.fromCharCode(223)}stab ${formated}`);
      this.updateScale({ size, resolution: formated, showScale: ScaleLine.SHOW_SCALE });
      this.renderedHTML_ = html;
    }

    this.draw({ unit, length, size, canvas: this.canvas_ });
    if (!this.renderedVisible_) {
      this.toggleElement(true);
    }
  }

  /**
   * Gets the scale line as base 64 encoded image.
   * @returns The scale line as base 64 encoded image.
   */
  export() {
    return this.getCanvas().toDataURL('image/png');
  }

  /**
   * Update the scale element
   *
   * @param {object} options The options
   * @param {number} options.size The width.
   * @param {string} options.resolution The resolution
   * @param {boolean} options.showScale If `true` the resolution will be shown
   */
  updateScale(options) {
    const scaleElements = document.getElementsByClassName(CSS_CLASS_SCALE);
    if (scaleElements.length === 0) { return; }

    const { size, resolution, showScale } = options;

    const scale = scaleElements[0];
    scale.style.left = size + 50;
    scale.innerHTML = (!showScale)
      ? ''
      : `M ${resolution}`;
  }
}

export default ScaleLine;

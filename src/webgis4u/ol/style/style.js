/**
 * @module webgis4u/ol/style/style
 */

import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Circle from 'ol/style/Circle';
import * as color from './color';

/**
 * @typedef GetPointStyleOptions
 * @type {object}
 * @property {number} width Width
 * @property {number} radius Radius
 * @property {ol.Color} strokeColor Stroke color
 * @property {ol.Color} fillColor Fill color
 */

/**
 * @typedef GetIconStyleOptions
 * @type {object}
 * @property {string} src The image url or base64 encoded image
 * @property {number} anchorX The anchorX
 * @property {number} anchorY The anchorY
 * @property {number} opacity The opacity
 */

/**
 * @typedef GetStyleOptions
 * @type {GetPointStyleOptions}
 * @property {Array<number>} [lineDash] the lindash.
 */

/**
 * Creates a new point style.
 *
 * @param {GetPointStyleOptions} options The options
 */
export function getPointStyle(options) {
  const {
    width, radius, strokeColor, fillColor,
  } = options;

  return new Style({
    image: new Circle({
      radius,
      fill: new Fill({ color: fillColor }),
      stroke: new Stroke({
        width,
        color: strokeColor,
      }),
    }),
  });
}

/**
 * Gets an icon style based on an image.
 *
 * @param {GetIconStyleOptions} options The options
 *
 * @returns {Style} The icon style
 */
export function getIconStyle(options) {
  const {
    src, anchorX, anchorY, opacity,
  } = options;

  return new Style({
    image: new Icon(/** @type {olx.style.IconOptions} */({
      src,
      opacity,
      anchor: [anchorX, anchorY],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
    })),
  });
}


/**
 * Creates an array of new styles.
 *
 * @param {GetStyleOptions} options The options
 *
 * @returns {Array<Style>} An array containing styles
 */
export function getStyle(options) {
  const {
    width, radius, strokeColor, fillColor, lineDash,
  } = options;

  const styles = [];
  styles.push(getPointStyle({ width, radius, strokeColor, fillColor }));
  styles.push(
    new Style({
      stroke: new Stroke({
        color: color.HALO,
        width: width + 2,
      }),
    }),
  );

  styles.push(
    new Style({
      fill: new Fill({ color: fillColor }),
      stroke: new Stroke({
        width,
        lineDash,
        color: strokeColor,
      }),
    }),
  );

  return styles;
}

/**
 * The default select style.
 * @type {Array<Style>}
 * @see https://openlayers.org/en/latest/apidoc/module-ol_style_Style-Style.html
 */
export const SELECT = getStyle(3, 6, color.SELECT_STROKE, color.SELECT_FILL);
/**
 * The default hover style.
 * @type {Array<Style>}
 * @see https://openlayers.org/en/latest/apidoc/module-ol_style_Style-Style.html
 */
export const HOVER = getStyle(3, 6, color.HOVER_STROKE, color.HOVER_FILL);
/**
 * The default modify style.
 * @type {Array<Style>}
 * @see https://openlayers.org/en/latest/apidoc/module-ol_style_Style-Style.html
 */
export const MODIFY = getStyle(3, 6, color.MODIFY_STROKE, color.MODIFY_FILL);

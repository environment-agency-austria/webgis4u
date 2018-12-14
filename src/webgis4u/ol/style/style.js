/**
 * @module webgis4u/ol/style/style
 */

import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
// import Icon from 'ol/style/Icon';
import Circle from 'ol/style/Circle';
import * as color from './color';

/**
 * Creates a new point style
 *
 * @param {number} width Width
 * @param {number} radius Radius
 * @param {ol.Color} strokeColor Stroke color
 * @param {ol.Color} fillColor Fill color
 */
export function getPointStyle(width, radius, strokeColor, fillColor) {
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
 * @param {string} src The image url or base64 encoded image.
 * @param {number} anchorX The anchorX.
 * @param {number} anchorY The anchorY
 *
 * @returns {Style} The icon style.
 */
// function getIconStyle(src, anchorX, anchorY, opacity) {
//   return new Style({
//     image: new Icon(/** @type {olx.style.IconOptions} */({
//       src,
//       opacity,
//       anchor: [anchorX, anchorY],
//       anchorXUnits: 'fraction',
//       anchorYUnits: 'fraction',
//     })),
//   });
// }


/**
 * Creates an array of new styles
 *
 * @param {type} width The width in pixel.
 * @param {type} width The radius in pixel.
 * @param {ol.Color} color The color.
 * @param {Array.number} lineDash the lindash.
 *
 * @returns {Array<Style>} An array containing styles.
 */
export function getStyle(width, radius, strokeColor, fillColor, lineDash) {
  const styles = [];
  styles.push(getPointStyle(width, radius, strokeColor, fillColor));
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

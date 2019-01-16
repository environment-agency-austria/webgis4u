/**
 * @module webgis4u/ol/util/getMapType
 */

import Map from 'ol/Map';

/**
 * Describes the different map types
 * @enum
 */
export const MapTypeEnum = {
  Unknown: 'unknown',
  Embedded: 'embedded',
  Large: 'large',
};
Object.freeze(MapTypeEnum);

/**
 * Get the map type
 * @param {ol.Map} map Map
 */
export function getMapType(map) {
  if (!(map instanceof Map)) { return MapTypeEnum.Unknown; }

  const mapTarget = map.getTargetElement();
  const { classList } = mapTarget;
  if (classList.contains('webgis4u-large-map')) {
    return MapTypeEnum.Large;
  }
  if (classList.contains('webgis4u-embedded-map')) {
    return MapTypeEnum.Embedded;
  }

  // Fallback to unknown
  return MapTypeEnum.Unknown;
}

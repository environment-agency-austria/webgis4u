import { getCenter } from 'ol/extent';
import Point from 'ol/geom/Point';

/**
 * approximate the center of a geometry. This function is optimized
 * for rendering quickly a lot of complex geometries (e.g. styled
 * with an icon or a regular shape positionned at the feature
 * center).
 *
 * @param {module:ol/geom~Geometry} geometry any geometry
 *
 * @return {Point} point contained in the geometry
 */
export function getPseudoCenter(geometry) {
  if (!geometry || !geometry.getType) {
    return null;
  }

  const geometryType = geometry.getType();
  if (geometryType === 'Point') {
    return geometry;
  }
  // a simple and quick method for complex polygons
  let center = getCenter(geometry.getExtent());
  if (geometryType !== 'Circle') {
    // the center could be out of the geometry in the case of a
    // multi polygon or concave shape, i.e. having at least 5
    // coordinates.
    if (!geometry.intersectsCoordinate(center)) {
      center = geometry.getClosestPoint(center);
    }
  }

  return new Point(center);
}

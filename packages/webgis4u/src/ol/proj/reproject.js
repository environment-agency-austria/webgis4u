/**
 * @module webgis4u/ol/proj/reproject
 */

/**
 * Gets a reprojected geometry without side effects (the original geometry is cloned).
 *
 * @param {ol.geom.Geometry} geometry
 * @param {ol.proj.Projection|string} source The current (=original) projection of the geometry.
 * @param {ol.proj.Projection|string} target
 * The target (=destination) projection to which the geometry will be transformed.
 *
 * @returns {ol.geom.Geometry} The reprojected geometry as new independed Object.
 *
 * @example
 * // Reprojects the given geometry from EPSG:31287 to EPSG:3875
 * const reprojectedGeom = reproject(myGeom, 'EPSG:31287','EPSG:3875');
 */
export function reproject(geometry, source, target) {
  const geom = geometry.clone();
  geom.transform(source, target);
  return geom;
}

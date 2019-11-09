/**
 * Calls dispose on a map
 *
 * @param {ol.Map} map The map to dispose
 */
export const disposeMap = (map) => {
  const target = map.getTarget();
  map.setTarget(null);
  if (target && target.parentNode) {
    target.parentNode.removeChild(target);
  }
  map.dispose();
};

import Interaction from 'ol/interaction/Interaction';
import { doubleClick } from 'ol/events/condition';
import { containsExtent, getCenter } from 'ol/extent';

import { fromPixel, fromFeatures, fromExtents } from '../extent';

/**
 * @typedef {module:ol/events/condition~Condition} Condition
 */
/**
 * @typedef {module:ol/mapbrowserevent~MapBrowserEvent} MapBrowserEvent
 */
/**
 * @typedef {module:ol/source/cluster~ClusterSource} ClusterSource
 */
/**
 * @typedef {module:ol/feature~Feature} Feature
 */
/**
 * @typedef {module:ol/extent~Extent} Extent
 */
/**
 * @typedef {module:ol/layer/vector~VectorLayer} VectorLayer
 */

/**
 * @param {Feature} feature
 *
 * @returns {Feature[] | undefined}
 * The features that is represented by a cluster source feature
 */
function getFeaturesFromClusterFeature(feature) {
  if (!feature) {
    return;
  }

  const features = feature.get('features');
  if (!features) {
    return;
  }

  return features;
}

/**
 * @typedef {object} ClusterClickAndZoomOptions
 * @property {VectorLayer[]} clusters The cluster layers
 * @property {number} [duration=500] The zoom duration
 * @property {Condition} [condition=doubleClick] The condition
 */

/**
 * @param {ClusterClickAndZoomOptions} opt_options The create options
 */
export class ClusterZoom extends Interaction {
  /**
   * @type {number}
   */
  duration;

  /**
   * @type {ClusterSource[]}
   */
  clusters;

  constructor(options) {
    const { clusters, condition = doubleClick, duration = 500 } = options || {};

    /**
     * @param {MapBrowserEvent} mapBrowserEvent
     * @returns {boolean}
     */
    const handleEvent = (mapBrowserEvent) => {
      if (condition(mapBrowserEvent)) {
        return this.handleClick(mapBrowserEvent);
      }

      return true;
    };

    super({ handleEvent });

    if (!Array.isArray(clusters)) {
      throw new Error('Clusters must be an array');
    }

    this.duration = duration;
    this.clusters = clusters;
  }

  /**
   * @param {MapBrowserEvent} mapBrowserEvent The original event
   * @param {ClusterSource} cluster The cluster source
   *
   * @returns {Extent | undefined}
   * An extent centered around the clicked features for the given cluster source
   */
  getExtentFromCluster = (mapBrowserEvent, cluster) => {
    const { coordinate, pixel, map } = mapBrowserEvent;
    const size = cluster.getDistance();

    const closestFeature = cluster.getClosestFeatureToCoordinate(coordinate);
    if (!closestFeature) {
      // No closest feature, there is nothing more to compare
      return;
    }

    // Create an extent with a size of "distance" and the clicked coordinate in the center
    const clusterDistanceBoundingExtent = fromPixel({
      pixel,
      map,
      size,
    });

    if (!containsExtent(clusterDistanceBoundingExtent, closestFeature.getGeometry().getExtent())) {
      // Closest feature is not in the extent, so not within the cluster distance
      return;
    }

    const features = getFeaturesFromClusterFeature(closestFeature);
    if (!features) {
      // There are no features represented by the closest feature
      return;
    }

    return fromFeatures(features);
  }

  /**
   * @param {MapBrowserEvent} mapBrowserEvent The original event
   *
   * @returns {Extent | undefined}
   * The extent calculated from all visible cluster layers.
   */
  calculateExtent = (mapBrowserEvent) => {
    const extents = this.clusters.filter(
      l => l.getVisible(),
    ).map(c => this.getExtentFromCluster(mapBrowserEvent, c.getSource()));
    const filtered = extents.filter(e => e !== undefined);
    return filtered.length === 0 ? undefined : fromExtents(...filtered);
  }

  /**
   * Fired when the user clicks
   *
   * @param {MapBrowserEvent} mapBrowserEvent
   * @returns {boolean}
   */
  handleClick = (mapBrowserEvent) => {
    // No map, no fun
    const { map } = mapBrowserEvent;
    if (!map) {
      return true;
    }

    // Try to create a extent containing the clustered features
    const clusterExtent = this.calculateExtent(mapBrowserEvent);
    if (clusterExtent === undefined) {
      // If no extent was returned, don't handle the event
      return true;
    }

    // Center and zoom towards the calculated extent
    const view = map.getView();
    const { duration } = this;
    view.fit(clusterExtent, { duration });
    view.animate({
      center: getCenter(clusterExtent),
      duration,
    });

    return false;
  }
}

export default ClusterZoom;

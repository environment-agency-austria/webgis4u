import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Cluster, OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';

import ClusterZoom from 'webgis4u/ol/interaction/ClusterZoom';

/**
 * Initializes the map
 */
export function initialize(mapConfig) {
  const distance = 100;

  const count = 20000;
  const features = new Array(count);
  const e = 4500000;
  for (let i = 0; i < count; i += 1) {
    const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
    features[i] = new Feature(new Point(coordinates));
  }

  const source = new VectorSource({
    features,
  });

  const clusterSource = new Cluster({
    distance,
    source,
  });

  const styleCache = {};
  const clusters = new VectorLayer({
    source: clusterSource,
    style: function(feature) {
      var size = feature.get('features').length;
      var style = styleCache[size];
      if (!style) {
        style = new Style({
          image: new CircleStyle({
            radius: 10,
            stroke: new Stroke({
              color: '#fff'
            }),
            fill: new Fill({
              color: '#3399CC'
            })
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: '#fff'
            })
          })
        });
        styleCache[size] = style;
      }
      return style;
    }
  });

  const raster = new TileLayer({
    source: new OSM(),
  });

  const map = new Map({
    ...mapConfig,
    layers: [raster, clusters],
    target: 'map',
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });

  const clusterClickInteraction = new ClusterZoom({ clusters: [clusters] });
  map.addInteraction(clusterClickInteraction);

  return map;
}

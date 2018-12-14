/**
 * @fileoverview EPSG projections relevant to the austrian area
 * @module webgis4u/ol/proj/epsg31287
 */

import proj4 from 'proj4';
import * as proj from 'ol/proj';
import { register } from 'ol/proj/proj4';

/* SRS identifiers */
export const EPSG31287_ID = 'EPSG:31287';
export const EPSG31254_ID = 'EPSG:31254';
export const EPSG31255_ID = 'EPSG:31255';
export const EPSG31256_ID = 'EPSG:31256';
export const EPSG32632_ID = 'EPSG:32632';
export const EPSG32633_ID = 'EPSG:32633';

/* Define the projections relevant for austria */
proj4.defs([
  [EPSG31287_ID, '+proj=lcc +lat_1=49 +lat_2=46 +lat_0=47.5 +lon_0=13.33333333333333 +x_0=400000 +y_0=400000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs'],
  [EPSG31254_ID, '+proj=tmerc +lat_0=0 +lon_0=10.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs'],
  [EPSG31255_ID, '+proj=tmerc +lat_0=0 +lon_0=13.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs'],
  [EPSG31256_ID, '+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs'],
  [EPSG32632_ID, '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'],
  [EPSG32633_ID, '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'],
]);

/* register the ol library with proj4 */
register(proj4);

/* lambert MGI */
/**
 * MGI / Austria Lambert
 * @see https://epsg.io/31287
 * @see https://openlayers.org/en/latest/apidoc/module-ol_proj_Projection-Projection.html
 *
 * @type {ol.proj.Projection}
 */
export const EPSG31287 = proj.get(EPSG31287_ID);
EPSG31287.setExtent([107778.5323, 286080.6331, 694883.9348, 575953.6150]);
/* gauss krueger */
/**
 * MGI / Austria GK West
 * @see https://epsg.io/31254
 * @see https://openlayers.org/en/latest/apidoc/module-ol_proj_Projection-Projection.html
 *
 * @type {ol.proj.Projection}
 */
export const EPSG31254 = proj.get(EPSG31254_ID);
EPSG31254.setExtent([-61418.2059, 173743.1182, 114487.3898, 285683.9475]);
/**
 * MGI / Austria GK Central
 * @see https://epsg.io/31255
 * @see https://openlayers.org/en/latest/apidoc/module-ol_proj_Projection-Projection.html
 *
 * @type {ol.proj.Projection}
 */
export const EPSG31255 = proj.get(EPSG31255_ID);
EPSG31255.setExtent([-115771.3204, 130037.7189, 115359.4571, 408002.5351]);
/**
 * MGI / Austria GK East
 * @see https://epsg.io/31256
 * @see https://openlayers.org/en/latest/apidoc/module-ol_proj_Projection-Projection.html
 *
 * @type {ol.proj.Projection}
 */
export const EPSG31256 = proj.get(EPSG31256_ID);
EPSG31256.setExtent([-115317.3972, 151511.8020, 64307.1064, 432456.2246]);

/* UTM zones */
/**
 * WGS 84 / UTM zone 32N
 * @see https://epsg.io/32632
 * @see https://openlayers.org/en/latest/apidoc/module-ol_proj_Projection-Projection.html
 *
 * @type {ol.proj.Projection}
 */
export const EPSG32632 = proj.get(EPSG32632_ID);
EPSG32632.setExtent([166021.4431, 0.0000, 833978.5569, 9329005.1825]);
/**
 * WGS 84 / UTM zone 33N
 * @see https://epsg.io/32633
 * @see https://openlayers.org/en/latest/apidoc/module-ol_proj_Projection-Projection.html
 *
 * @type {ol.proj.Projection}
 */
export const EPSG32633 = proj.get(EPSG32633_ID);
EPSG32633.setExtent([166021.4431, 0.0000, 833978.5569, 9329005.1825]);

/**
 * @module webgis4u/ol/source/basemap/common
 */

import WMTSTileGrid from 'ol/tilegrid/WMTS';
import * as proj from 'ol/proj';

export const tileGrid = new WMTSTileGrid({
  origin: [-20037508.3428, 20037508.3428],
  resolutions: [
    559082264.029 * 0.28E-3,
    279541132.015 * 0.28E-3,
    139770566.007 * 0.28E-3,
    69885283.0036 * 0.28E-3,
    34942641.5018 * 0.28E-3,
    17471320.7509 * 0.28E-3,
    8735660.37545 * 0.28E-3,
    4367830.18773 * 0.28E-3,
    2183915.09386 * 0.28E-3,
    1091957.54693 * 0.28E-3,
    545978.773466 * 0.28E-3,
    272989.386733 * 0.28E-3,
    136494.693366 * 0.28E-3,
    68247.3466832 * 0.28E-3,
    34123.6733416 * 0.28E-3,
    17061.8366708 * 0.28E-3,
    8530.91833540 * 0.28E-3,
    4265.45916770 * 0.28E-3,
    2132.72958385 * 0.28E-3,
    1066.36479193 * 0.28E-3,
  ],
  matrixIds: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  ],
});

const templateOutputParameters = '{Layer}/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}';
const templateJpg = `${templateOutputParameters}.jpeg`;
const templatePng = `${templateOutputParameters}.png`;

/**
* Basemap URLs for PNG images
*/
export const urlsJpg = [
  `https://maps1.wien.gv.at/basemap/${templateJpg}`,
  `https://maps2.wien.gv.at/basemap/${templateJpg}`,
  `https://maps3.wien.gv.at/basemap/${templateJpg}`,
  `https://maps4.wien.gv.at/basemap/${templateJpg}`,
];

export const projection = proj.get('EPSG:3857');


/**
* Basemap URLs for JPEG images
*/
export const urlsPng = [
  `https://maps1.wien.gv.at/basemap/${templatePng}`,
  `https://maps2.wien.gv.at/basemap/${templatePng}`,
  `https://maps3.wien.gv.at/basemap/${templatePng}`,
  `https://maps4.wien.gv.at/basemap/${templatePng}`,
];

import * as proj from 'ol/proj';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/Linestring';

import { reproject } from './reproject';
import { EPSG31287_ID } from './epsg31287';

describe('webgis4u/ol/proj/reproject', () => {
  const epsg3857Projection = proj.get('EPSG:3857');
  const epsg31287Projection = proj.get(EPSG31287_ID);

  const points = [{
    name: '100kmN26E43',
    epsg31287Coords: [175452.571200000010000, 344618.484699999970000],
    epsg3857Coords: [1155575.683600000100000, 5935988.346850000300000],
  }, {
    name: '100kmN26E44',
    epsg31287Coords: [275246.346000000020000, 340265.391999999990000],
    epsg3857Coords: [1301689.022960000000000, 5933935.515040000000000],
  }, {
    name: '100kmN26E45',
    epsg31287Coords: [375044.723200000010000, 335829.028999999980000],
    epsg3857Coords: [1447698.874570000000000, 5929287.716540000400000],
  }, {
    name: '100kmN27E45',
    epsg31287Coords: [379399.202899999970000, 435762.099899999970000],
    epsg3857Coords: [1453540.628610000000000, 6077110.666539999700000],
  }, {
    name: '100kmN26E46',
    epsg31287Coords: [474854.100600000010000, 331309.853899999990000],
    epsg3857Coords: [1593525.500280000000000, 5922053.190130000000000],
  }, {
    name: '100kmN27E46',
    epsg31287Coords: [479233.181600000010000, 431224.983400000030000],
    epsg3857Coords: [1601901.041890000000000, 6069603.523900000400000],
  }, {
    name: '100kmN28E46',
    epsg31287Coords: [483672.364300000020000, 531118.163500000020000],
    epsg3857Coords: [1610659.222270000000000, 6219647.565250000000000],
  }, {
    name: '100kmN26E47',
    epsg31287Coords: [574680.961400000030000, 326708.729899999980000],
    epsg3857Coords: [1739089.982090000100000, 5912244.709640000000000],
  }, {
    name: '100kmN27E47',
    epsg31287Coords: [579082.901100000020000, 426600.038999999990000],
    epsg3857Coords: [1749980.955409999900000, 6059426.475890000400000],
  }, {
    name: '100kmN27E48',
    epsg31287Coords: [678954.515000000010000, 421888.620600000020000],
    epsg3857Coords: [1897697.245000000100000, 6046598.297740000300000],
  }, {
    name: '100kmN28E47',
    epsg31287Coords: [583563.256399999950000, 526466.842100000010000],
    epsg3857Coords: [1761368.154110000000000, 6209076.944609999700000],
  }];

  it('check precision EPSG:3857 Google -> EPSG:31287 Lambert', () => {
    points.forEach((point) => {
      const geomStart = new Point(point.epsg3857Coords, 'XY');
      const geomExpected = new Point(point.epsg31287Coords, 'XY');
      const result = reproject(geomStart, epsg3857Projection, epsg31287Projection);
      const line = new LineString([result.getCoordinates(), geomExpected.getCoordinates()], 'XY');
      expect(line.getLength()).toBeLessThan(0.01); // 1 cm
    });
  });

  it('check precision EPSG:31287 Lambert -> EPSG:3857 Google', () => {
    points.forEach((point) => {
      const geomStart = new Point(point.epsg31287Coords, 'XY');
      const geomExpected = new Point(point.epsg3857Coords, 'XY');
      const result = reproject(geomStart, epsg31287Projection, epsg3857Projection);
      const line = new LineString([result.getCoordinates(), geomExpected.getCoordinates()], 'XY');
      expect(line.getLength()).toBeLessThan(0.01); // 1 cm
    });
  });
});

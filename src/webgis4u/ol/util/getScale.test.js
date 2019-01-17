import View from 'ol/View';
import { EPSG31287_ID } from '../proj/austria';

import { disposeMap, createMap } from '../../../../test/utils/ol';

import { getScale } from './getScale';


describe('webgis4u/ol/util/getScale', () => {
  const mockMapGetSize = jest.fn().mockReturnValue([1841, 300]);
  let map;

  /**
   * Set up the map
   */
  const setupMap = ((projection) => {
    map = createMap({
      view: new View({
        projection,
        center: [0, 0],
        zoom: 0,
        extent: [-2.5, -2.5, 2.5, 2.5],
        resolution: 1,
        resolutions: [4, 2, 1, 0.5, 0.25],
      }),
    });

    map.getSize = mockMapGetSize;
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
  });

  describe('getScale', () => {
    it('should return scale', () => {
      setupMap(EPSG31287_ID);
      const scale = getScale(map);

      expect(scale).toBeDefined();
      expect(scale.resolution).toBeDefined();
      expect(scale.denominator).toBeDefined();
      expect(scale.formated).toBeDefined();
    });

    it('should return scale without denominator', () => {
      setupMap();

      const mapViewProjection = map.getView().getProjection();
      const getUnitsSpy = jest.spyOn(mapViewProjection, 'getUnits');
      getUnitsSpy.mockReturnValue('miles');
      const scale = getScale(map);

      expect(scale).toBeDefined();
      expect(scale.denominator).toBeUndefined();
      expect(scale.resolution).toBeDefined();
      expect(scale.formated).toBeDefined();
    });

    it('should catch internal error and return scale without denominator', () => {
      setupMap();

      mockMapGetSize.mockReturnValue([Number.NaN, Number.NaN]);
      const scale = getScale(map);

      expect(scale).toBeDefined();
      expect(scale.denominator).toBeUndefined();
      expect(scale.resolution).toBeUndefined();
      expect(scale.formated).toBeDefined();
    });
  });
});

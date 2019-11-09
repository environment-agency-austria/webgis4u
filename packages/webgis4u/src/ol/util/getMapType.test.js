import { disposeMap, createMap } from '../../../test/utils/ol';

import { getMapType, MapTypeEnum } from './getMapType';


describe('webgis4u/ol/util/getMapType', () => {
  let map;

  beforeEach(() => {
    map = createMap();
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
  });

  describe('should return unknown', () => {
    it('for non-map', () => {
      const r = getMapType(null);
      expect(r).toBe(MapTypeEnum.Unknown);
    });

    it('for map with unknown type', () => {
      const r = getMapType(map);
      expect(r).toBe(MapTypeEnum.Unknown);
    });
  });

  describe('should return type', () => {
    const testCases = [
      [MapTypeEnum.Large, 'webgis4u-large-map'],
      [MapTypeEnum.Embedded, 'webgis4u-embedded-map'],
    ];

    test.each(testCases)('%s for css class %s', (expectedType, cssClass) => {
      map.getTargetElement().classList.add(cssClass);
      const r = getMapType(map);
      expect(r).toBe(expectedType);
    });
  });
});

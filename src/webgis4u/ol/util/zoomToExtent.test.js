import * as olExtent from 'ol/extent';

import { zoomToExtent } from './zoomToExtent';

jest.mock('ol/extent');

describe('webgis4u/ol/util/zoomToExtent', () => {
  const mockExtent = [50, 50, 100, 100];
  afterEach(() => {
    olExtent.getSize.mockClear();
    olExtent.buffer.mockClear();
  });

  describe('should do nothing', () => {
    it('if map has no value', () => {
      zoomToExtent(mockExtent, null);
      expect(olExtent.getSize).not.toBeCalled();
    });
    it('if extent has no value', () => {
      zoomToExtent(null, {});
      expect(olExtent.getSize).not.toBeCalled();
    });

    it('if extent has Infinity values', () => {
      zoomToExtent([Infinity, 50, 100, 100], {});
      zoomToExtent([50, Infinity, 100, 100], {});
      zoomToExtent([50, 50, Infinity, 100], {});
      zoomToExtent([50, 50, 100, Infinity], {});

      expect(olExtent.getSize).not.toBeCalled();
    });
  });

  describe('should return', () => {
    let map;
    let mockFit;
    const mockMapGetSize = [100, 100];
    beforeEach(() => {
      mockFit = jest.fn();
      map = {
        getView: jest.fn(() => ({
          fit: mockFit,
        })),
        getSize: jest.fn(() => mockMapGetSize),
      };
    });

    it('should buffer extent', () => {
      const extent = [0, 50, 100, 100];
      olExtent.getSize.mockReturnValueOnce([0, 0]);
      olExtent.buffer.mockReturnValueOnce(mockExtent);
      zoomToExtent(extent, map);

      expect(olExtent.buffer).toBeCalled();
      expect(mockFit).toBeCalledWith(mockExtent, mockMapGetSize);
    });

    it('should not buffer extent', () => {
      olExtent.getSize.mockReturnValueOnce([50, 50]);
      zoomToExtent(mockExtent, map);

      expect(olExtent.buffer).not.toBeCalled();
      expect(mockFit).toBeCalledWith(mockExtent, mockMapGetSize);
    });
  });
});

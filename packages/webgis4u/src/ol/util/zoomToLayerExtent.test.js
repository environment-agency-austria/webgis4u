import * as olExtent from 'ol/extent';

import { zoomToExtent } from './zoomToExtent';

import { zoomToLayerExtent } from './zoomToLayerExtent';

jest.mock('ol/extent');
jest.mock('./zoomToExtent');

describe('webgis4u/ol/util/zoomToLayerExtent', () => {
  let vectorLayer;
  let mockForEachFeature;
  let mockFeatures;
  beforeEach(() => {
    zoomToExtent.mockClear();

    const mockFeature = {
      getGeometry: jest.fn(() => ({
        getExtent: jest.fn(),
      })),
    };
    mockFeatures = [
      mockFeature,
      mockFeature,
    ];
    mockForEachFeature = jest.fn((f) => {
      mockFeatures.forEach(feature => f(feature));
    });
    vectorLayer = {
      getSource: jest.fn(() => ({
        forEachFeature: mockForEachFeature,
      })),
    };
  });

  afterEach(() => {
    zoomToExtent.mockClear();
  });

  it('should extent to layer', () => {
    zoomToLayerExtent(vectorLayer, {});
    expect(olExtent.extend).toBeCalledTimes(mockFeatures.length);
    expect(zoomToExtent).toBeCalled();
  });
});

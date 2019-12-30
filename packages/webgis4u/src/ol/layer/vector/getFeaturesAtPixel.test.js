import { getFeaturesAtPixel } from './getFeaturesAtPixel';

describe('webgis4u/ol/layer/vector/getFeaturesAtPixel', () => {
  const mockPixel = [0, 0];
  const mockMap = {
    getCoordinateFromPixel: jest.fn(p => p),
  };
  const mockSource = {
    forEachFeatureIntersectingExtent: jest.fn(() => false),
  };
  const mockLayer = {
    getSource: jest.fn(() => mockSource),
  };

  const defaultOptions = {
    pixel: mockPixel,
    map: mockMap,
    layer: mockLayer,
  };

  it('should return empty array', () => {
    const result = getFeaturesAtPixel(defaultOptions);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should return element', () => {
    const mockFeature = {
      clone: jest.fn(() => jest.fn()),
    };
    mockSource.forEachFeatureIntersectingExtent.mockImplementation(
      (_, callback) => callback(mockFeature),
    );

    const result = getFeaturesAtPixel({
      ...defaultOptions,
      clone: false,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(mockFeature.clone).toBeCalledTimes(0);
  });

  it('should call clone', () => {
    const mockFeature = {
      clone: jest.fn(() => jest.fn()),
    };
    mockSource.forEachFeatureIntersectingExtent.mockImplementation(
      (_, callback) => callback(mockFeature),
    );

    const result = getFeaturesAtPixel({
      ...defaultOptions,
      clone: true,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(mockFeature.clone).toBeCalledTimes(1);
  });

  // it('should return false for lower than min', () => {
  //   const result = isDisplayable(mockLayer, minResolution - 1);

  //   expect(result).toBe(false);
  // });

  // it('should return false for higher than max', () => {
  //   const result = isDisplayable(mockLayer, maxResolution + 1);

  //   expect(result).toBe(false);
  // });
});

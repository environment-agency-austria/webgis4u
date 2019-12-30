import { fromFeatures } from './fromFeatures';

jest.requireActual('ol/extent');
const { default: Collection } = jest.requireActual('ol/Collection');

describe('webgis4u/ol/extent/fromFeatures', () => {
  const maxX = 10;
  const maxY = 10;
  const minX = -10;
  const minY = -10;
  const extent1 = [0, 0, maxX, maxY];
  const extent2 = [minX, minY, 0, 0];
  const feature1 = {
    getGeometry: jest.fn(() => {
      return {
        getExtent: jest.fn(() => {
          return extent1;
        }),
      };
    }),
  };
  const feature2 = {
    getGeometry: jest.fn(() => {
      return {
        getExtent: jest.fn(() => {
          return extent2;
        }),
      };
    }),
  };

  it('should create empty', () => {
    const result = fromFeatures([]);

    expect(Array.isArray(result)).toBeTruthy();
  });

  it('should return extent from single feature', () => {
    const result = fromFeatures([feature1]);

    expect(Array.isArray(result)).toBeTruthy();
    expect(feature1.getGeometry).toBeCalled();
    expect(feature1.getGeometry).toBeCalled();
    expect(result[0]).toBe(extent1[0]);
    expect(result[1]).toBe(extent1[1]);
    expect(result[2]).toBe(extent1[2]);
    expect(result[3]).toBe(extent1[3]);
  });

  it('should return combined extent from feature array', () => {
    const result = fromFeatures([feature1, feature2]);

    expect(Array.isArray(result)).toBeTruthy();
    expect(feature1.getGeometry).toBeCalled();
    expect(feature1.getGeometry).toBeCalled();
    expect(result[0]).toBe(minX);
    expect(result[1]).toBe(minY);
    expect(result[2]).toBe(maxX);
    expect(result[3]).toBe(maxY);
  });

  it('should return combined extent from feature collection', () => {
    const featureCollection = new Collection([feature1, feature2]);
    const result = fromFeatures(featureCollection);

    expect(Array.isArray(result)).toBeTruthy();
    expect(feature1.getGeometry).toBeCalled();
    expect(feature1.getGeometry).toBeCalled();
    expect(result[0]).toBe(minX);
    expect(result[1]).toBe(minY);
    expect(result[2]).toBe(maxX);
    expect(result[3]).toBe(maxY);
  });
});

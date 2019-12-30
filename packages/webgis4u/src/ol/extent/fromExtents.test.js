import { fromExtents } from './fromExtents';

jest.requireActual('ol/extent');

describe('webgis4u/ol/extent/fromExtents', () => {
  const maxX = 10;
  const maxY = 10;
  const minX = -10;
  const minY = -10;
  const extent1 = [0, 0, maxX, maxY];
  const extent2 = [minX, minY, 0, 0];


  it('should create empty', () => {
    const result = fromExtents();

    expect(Array.isArray(result)).toBeTruthy();
  });

  it('should return extent from single feature', () => {
    const result = fromExtents(extent1);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0]).toBe(extent1[0]);
    expect(result[1]).toBe(extent1[1]);
    expect(result[2]).toBe(extent1[2]);
    expect(result[3]).toBe(extent1[3]);
  });

  it('should return combined extent from feature array', () => {
    const result = fromExtents(extent1, extent2);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0]).toBe(minX);
    expect(result[1]).toBe(minY);
    expect(result[2]).toBe(maxX);
    expect(result[3]).toBe(maxY);
  });
});

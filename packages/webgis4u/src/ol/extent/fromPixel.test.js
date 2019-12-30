import { fromPixel } from './fromPixel';

jest.requireActual('ol/extent');
jest.requireActual('ol/size');

describe('webgis4u/ol/extent/fromPixel', () => {
  const pixel = [0, 0];
  const mockMap = {
    getCoordinateFromPixel: jest.fn(p => p),
  };

  it('should create extent with size(number)', () => {
    const radius = 5;
    const result = fromPixel({
      pixel,
      size: radius * 2,
      map: mockMap,
    });

    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(4);
    expect(result[0]).toBe(pixel[0] - radius);
    expect(result[1]).toBe(pixel[1] - radius);
    expect(result[2]).toBe(pixel[0] + radius);
    expect(result[3]).toBe(pixel[1] + radius);
  });

  it('should create extent with size(size)', () => {
    const width = 20;
    const height = 10;
    const result = fromPixel({
      pixel,
      size: [width, height],
      map: mockMap,
    });

    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(4);
    expect(result[0]).toBe(pixel[0] - width / 2);
    expect(result[1]).toBe(pixel[1] - height / 2);
    expect(result[2]).toBe(pixel[0] + width / 2);
    expect(result[3]).toBe(pixel[1] + height / 2);
  });
});

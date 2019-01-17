import { createImageFromMap } from './createImageFromMap';

describe('webgis4u/ol/util/createImagerFromMap', () => {
  const mockImage = 'such-image';
  let map;
  let mockRenderSync;

  beforeEach(() => {
    let callback;
    mockRenderSync = jest.fn(() => {
      callback({
        context: {
          canvas: {
            toDataURL: jest.fn(() => mockImage),
          },
        },
      });
    });

    map = {
      once: jest.fn((s, cb) => { callback = cb; }),
      renderSync: mockRenderSync,
    };
  });

  it('shold create an image', () => {
    const callback = jest.fn();
    createImageFromMap(map, callback);

    expect(map.once).toBeCalledTimes(1);
    expect(map.renderSync).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(mockImage);
  });

  it('shold throw error an image', () => {
    const callback = jest.fn();
    mockRenderSync.mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => {
      createImageFromMap(map, callback);
    }).toThrowError();
    expect(callback).not.toBeCalled();
  });
});

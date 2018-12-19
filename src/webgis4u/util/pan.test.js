import { createMap, disposeMap } from '../../../test-utils/ol';

import { pan } from './pan';

describe('webgis4u/util/pan', () => {
  let map;

  beforeEach(() => {
    map = createMap();
    map.getSize = jest.fn(() => [100, 100]);
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
  });

  it('should pan', () => {
    // Get the original state
    const view = map.getView();
    const originalCenter = view.getCenter();

    // now pan and get the new center
    pan({
      map,
      delta: [-0.3, 0.4],
      animationOptions: { duration: 0 },
    });
    const newCenter = view.getCenter();

    // Test results
    expect(newCenter[0]).toBeLessThan(originalCenter[0]);
    expect(newCenter[1]).toBeGreaterThan(originalCenter[1]);
  });
});

import { disposeMap, createMap } from '../../../../../test/utils/ol';
import { pan } from '../../../util/ol/pan';

import { CSS_CONTROL_PREFIX } from '../common';
import PanBar from '../PanBar';

jest.mock('../../../util/ol/pan');

describe('webgis4u/ol/control/PanBar', () => {
  const CSS_CLASS = `.${CSS_CONTROL_PREFIX}-panbar`;
  let map;
  let panBar;

  beforeEach(() => {
    // Clear mocks
    pan.mockClear();

    // Prepare map and control
    panBar = new PanBar();
    map = createMap({
      controls: [panBar],
    });
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
    panBar = null;
  });

  it('should render', () => {
    map.renderSync();
    const rootElement = map.getTarget().querySelectorAll(CSS_CLASS);
    expect(rootElement.length).toBe(1);
  });

  it('should throw error on invalid direction', () => {
    expect(() => {
      panBar.panInDirection('non valid value');
    }).toThrow();
  });

  describe('interaction', () => {
    const CSS_PAN_PREFIX = `${CSS_CLASS}-pan`;

    // Test cases for unexpected
    const testCases = [
      ['up', `${CSS_PAN_PREFIX}-up`, (x, y) => {
        expect(x).toBe(0);
        expect(y).toBeGreaterThan(0);
      }],
      ['down', `${CSS_PAN_PREFIX}-down`, (x, y) => {
        expect(x).toBe(0);
        expect(y).toBeLessThan(0);
      }],
      ['right', `${CSS_PAN_PREFIX}-right`, (x, y) => {
        expect(x).toBeGreaterThan(0);
        expect(y).toBe(0);
      }],
      ['left', `${CSS_PAN_PREFIX}-left`, (x, y) => {
        expect(x).toBeLessThan(0);
        expect(y).toBe(0);
      }],
    ];

    test.each(testCases)('should handle click event (%s)', (name, selector, testFnc) => {
      map.renderSync();

      // Find the clickable element
      const clickableElement = map.getTarget().querySelectorAll(selector);
      expect(clickableElement.length).toBe(1);

      // Simulate the click
      clickableElement[0].dispatchEvent(new Event('click'));
      expect(pan).toHaveBeenCalledTimes(1);

      // Check if pan was called with the right parameters
      const [x, y] = pan.mock.calls[0][0].delta;
      testFnc(x, y);
    });
  });
});

import { disposeMap, createMap } from '../../../../test/utils/ol';
import { pan } from '../../util/pan';

import PanBar from './PanBar';

jest.mock('../../util/pan');

describe('webgis4u/ol/control/PanBar', () => {
  const CSS_CLASS_PREFIX = '.ugis-ctrl';
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
    const rootElement = map.getTarget().querySelectorAll(`${CSS_CLASS_PREFIX}-panbar`);
    expect(rootElement.length).toBe(1);
  });

  it('should throw error on invalid direction', () => {
    expect(() => {
      panBar.panInDirection('non valid value');
    }).toThrow();
  });

  describe('interaction', () => {
    const CSS_PREFIX = `${CSS_CLASS_PREFIX}-pan`;

    /**
     * Simulates a click event
     * @param {HTMLElement} element
     */
    const simulateClick = (element) => {
      const event = new Event('mock');
      const { listener } = element.ol_lm.click[0];

      listener(event);
    };


    // Test cases for unexpected
    const testCases = [
      ['up', `${CSS_PREFIX}-up`, (x, y) => {
        expect(x).toBe(0);
        expect(y).toBeGreaterThan(0);
      }],
      ['down', `${CSS_PREFIX}-down`, (x, y) => {
        expect(x).toBe(0);
        expect(y).toBeLessThan(0);
      }],
      ['right', `${CSS_PREFIX}-right`, (x, y) => {
        expect(x).toBeGreaterThan(0);
        expect(y).toBe(0);
      }],
      ['left', `${CSS_PREFIX}-left`, (x, y) => {
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
      simulateClick(clickableElement[0]);
      expect(pan).toHaveBeenCalledTimes(1);

      // Check if pan was called with the right parameters
      const [x, y] = pan.mock.calls[0][0].delta;
      testFnc(x, y);
    });
  });
});

import { disposeMap, createMap, createLayers } from '../../../../test/utils/ol';

import Measure, { MeasurementTypeEnum, CSS_CLASS as MeasureCssClass } from './Measure';

import * as moduleFormatUnitValue from '../../util/string/formatUnitValue';


describe('webgis4u/ol/control/OverviewMap', () => {
  // let mockOverviewMapWrapper;
  let map;
  let control;
  let layers;

  const spyFormatUnitValue = jest.spyOn(moduleFormatUnitValue, 'formatUnitValue');
  /**
   * Set up the control
   */
  const setupControl = (options) => {
    control = new Measure(options);
    map.addControl(control);
  };

  beforeEach(() => {
    // Prepare mock elements
    // Prepare layers
    layers = createLayers({ count: 1 });
    // Prepare map
    map = createMap({ layers });
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
    control = null;
    // Remove the mock element from the mock DOM
    document.getElementsByTagName('html')[0].innerHTML = '';
    // mockOverviewMapWrapper = null;
    //
  });

  describe('should contain control', () => {
    it('with an element inside the map', () => {
      setupControl();
      expect(map.getControls().getArray()).toContain(control);
    });

    it('should unset on setMap', () => {
      setupControl();
      control.setMap(null);
      expect(control.oldMap_).toBe(null);
    });
  });

  describe('should set/get type', () => {
    const testCases = [
      [MeasurementTypeEnum.Area],
      [MeasurementTypeEnum.Distance],
    ];

    test.each(testCases)('with the initial given type %s', (type) => {
      setupControl({ type });
      expect(control.getType()).toBe(type);
    });

    test.each(testCases)('with the set type %s', (type) => {
      setupControl();
      control.setType(type);
      expect(control.getType()).toBe(type);
    });

    it('with the default value', () => {
      setupControl();
      expect(control.getType()).toBe(MeasurementTypeEnum.Distance);
    });

    it('and ignore invalid values on set', () => {
      setupControl();
      control.setType('mock-type');
      expect(control.getType()).toBe(MeasurementTypeEnum.Distance);
    });
  });

  describe('toggleElement', () => {
    it('should toggle the element', () => {
      setupControl();
      control.toggleElement(true);
      expect(control.element.getAttribute('data-visible')).toBe('true');
    });
    it('should toggle the element', () => {
      setupControl();
      control.toggleElement(false);
      expect(control.element.getAttribute('data-visible')).toBe('false');
    });

    it('should not toggle if no element', () => {
      setupControl();
      control.element.parentNode.removeChild(control.element);
      control.toggleElement(true);
      expect(1).toBe(1);
    });
  });

  describe('display methods', () => {
    it('should return displayArea', () => {
      setupControl();
      spyFormatUnitValue.mockImplementationOnce(() => '15 m');
      const result = control.displayArea(15);
      expect(result).toBe('Fl&auml;che: 15 m');
    });
    it('should toggle the element', () => {
      setupControl();
      spyFormatUnitValue.mockImplementationOnce(() => '15 m');
      const result = control.displayLength(15);
      expect(result).toBe('L&auml;nge: 15 m');
    });
  });
});

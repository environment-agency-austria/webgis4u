import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';

import { disposeMap, createMap, createLayers } from '../../../../test/utils/ol';

import Measure, { MeasurementTypeEnum } from './Measure';

import * as moduleFormatUnitValue from '../../util/string/formatUnitValue';
import * as moduleReproject from '../proj/reproject';

describe('webgis4u/ol/control/OverviewMap', () => {
  let map;
  let control;
  let layers;

  const spyFormatUnitValue = jest.spyOn(moduleFormatUnitValue, 'formatUnitValue');
  const spyReproject = jest.spyOn(moduleReproject, 'reproject');
  /**
   * Set up the control
   */
  const setupControl = (options) => {
    control = new Measure(options);
    map.addControl(control);
  };

  beforeEach(() => {
    layers = createLayers({ count: 1 });
    map = createMap({ layers });
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
    control = null;
    document.getElementsByTagName('html')[0].innerHTML = '';
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
      control.element = null;
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

  describe('updateMeasurement', () => {
    it('should do nothing if sketch is null', () => {
      setupControl();
      control.sketch = null;
      control.updateMeasurement();
      expect(1).toBe(1);
      control.handleMeasurementShouldUpdate();
      expect(1).toBe(1);
    });
    it('should do nothing if sketch geometry is null', () => {
      setupControl();
      control.sketch = {
        getGeometry: jest.fn(),
      };
      control.updateMeasurement();
      expect(1).toBe(1);
    });
    it('should update for Polygon', () => {
      setupControl();
      control.sketch = {
        getGeometry: jest.fn(() => new Polygon([], 'XY')),
      };
      spyReproject.mockImplementationOnce(() => ({
        getArea: jest.fn(() => 15),
        getLength: jest.fn(() => 15),
      }));

      control.updateMeasurement();

      expect(control.element.innerHTML).toBe('Fläche: 15,00 m<sup>2</sup>');
    });
    it('should update for LineString', () => {
      setupControl();
      control.sketch = {
        getGeometry: jest.fn(() => new LineString([], 'XY')),
      };
      spyReproject.mockImplementationOnce(() => ({
        getArea: jest.fn(() => 15),
        getLength: jest.fn(() => 15),
      }));

      control.updateMeasurement();

      expect(control.element.innerHTML).toBe('Länge: 15,00 m');
    });
  });

  describe('draw event handlers', () => {
    it('should unset sketch on draw end', () => {
      setupControl();
      control.onDrawEnd();
      expect(control.sketch).toBeNull();
    });

    it('should set sketch on draw start', () => {
      const mockFeature = jest.fn();
      setupControl();
      control.onDrawStart({ feature: mockFeature });
      expect(control.sketch).toBe(mockFeature);
    });
  });

  describe('addInteraction', () => {
    it('should fail on invalid interaction type', () => {
      setupControl();
      expect(() => {
        control.addInteraction('mock-type');
      }).toThrow();
    });
  });
});

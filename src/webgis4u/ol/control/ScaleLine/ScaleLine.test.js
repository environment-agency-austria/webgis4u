import { disposeMap, createMap, createLayers } from '../../../../../test/utils/ol';

import ScaleLine, { ScaleLineUnitEnum, CSS_CLASS_SCALE } from '../ScaleLine';

import * as moduleConvertUnitValue from '../../../util/number/convertUnitValue';
import * as moduleOlUtilGetScale from '../../util/getScale';

describe('webgis4u/ol/control/OverviewMap', () => {
  let map;
  let control;
  let layers;

  const spyOlUtilGetScale = jest.spyOn(moduleOlUtilGetScale, 'getScale');
  const spyConvertUnitValue = jest.spyOn(moduleConvertUnitValue, 'convertUnitValue');

  const mockGetScaleResult = { resolution: 841.513895570164, denominator: 2385394, formated: '1: 2.385.394' };
  /**
   * Set up the control
   */
  const setupControl = (options) => {
    control = new ScaleLine(options);
    map.addControl(control);
  };

  beforeEach(() => {
    layers = createLayers({ count: 1 });
    map = createMap({ layers });
    // Prepare mocks
    spyConvertUnitValue.mockImplementation(({ value }) => {
      const unit = { abbreviation: 'km', factor: 1000 };
      return {
        value,
        unit,
        convertedValue: value * unit.factor,
      };
    });
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
    control = null;
    document.getElementsByTagName('html')[0].innerHTML = '';
    // Set back mocks
    spyConvertUnitValue.mockClear();
    spyOlUtilGetScale.mockClear();
  });

  describe('should contain control', () => {
    it('with an element inside the map', () => {
      setupControl();
      expect(map.getControls().getArray()).toContain(control);
    });

    it('do noting on map=null', () => {
      setupControl();

      const spyUpdateElement = jest.spyOn(control, 'updateElement');
      control.setMap(null);
      expect(spyUpdateElement).not.toBeCalled();
    });
  });

  describe('should set/get units', () => {
    const testCases = [
      [ScaleLineUnitEnum.METERS],
    ];

    test.each(testCases)('with the initial given type %s', (units) => {
      setupControl();
      control.setUnits(units);
      expect(control.getUnits()).toBe(units);
    });
  });

  describe('toggleElement', () => {
    it('should toggle the element (true)', () => {
      setupControl();
      control.toggleElement(true);
      expect(control.renderedVisible_).toBe(true);
      expect(control.element.getAttribute('data-visible')).toBe('true');
    });
    it('should toggle the element (false)', () => {
      setupControl();
      control.toggleElement(false);
      expect(control.renderedVisible_).toBe(false);
      expect(control.element.getAttribute('data-visible')).toBe('false');
    });

    it('should not toggle if no element', () => {
      setupControl();
      control.element = null;
      control.toggleElement(true);
      expect(1).toBe(1);
    });
  });

  describe('updateElement', () => {
    it('should hide the element (with not supported units)', () => {
      setupControl();
      spyOlUtilGetScale.mockReturnValueOnce(mockGetScaleResult);
      const spyToggleElement = jest.spyOn(control, 'toggleElement');

      control.setUnits('mock-unit');
      control.updateElement();

      expect(control.renderedHTML_).toBe('100000');
      expect(spyToggleElement).toBeCalledWith(true);
    });


    it('should hide the element (when size = NaN)', () => {
      setupControl();

      const spyToggleElement = jest.spyOn(control, 'toggleElement');
      control.updateElement();

      expect(spyToggleElement).toBeCalledWith(false);
    });

    describe('with a scale', () => {
      const mockPreviousRenderedHtml = '100km';

      it('should show the element and toggle the element', () => {
        setupControl();

        const spyToggleElement = jest.spyOn(control, 'toggleElement');
        control.renderedVisible_ = false;

        spyOlUtilGetScale.mockReturnValueOnce(mockGetScaleResult);
        control.updateElement();

        expect(spyToggleElement).toBeCalledWith(true);
      });
      it('should update the element and not toggle the element', () => {
        setupControl();

        const spyToggleElement = jest.spyOn(control, 'toggleElement');
        control.renderedVisible_ = true;

        spyOlUtilGetScale.mockReturnValueOnce(mockGetScaleResult);
        control.updateElement();

        expect(spyToggleElement).not.toBeCalled();
      });
      it('should update element and NOT reset the rendered HTML', () => {
        setupControl();

        control.renderedHTML_ = mockPreviousRenderedHtml;
        const spyUpdateScale = jest.spyOn(control, 'updateScale');

        spyOlUtilGetScale.mockReturnValueOnce(mockGetScaleResult);
        control.updateElement();

        expect(spyUpdateScale).not.toBeCalled();
      });
    });

    describe('viewState === null', () => {
      it('should update the element (without a viewState)', () => {
        setupControl();

        control.toggleElement = jest.fn();
        map.getView = jest.fn().mockReturnValueOnce(null);
        control.updateElement();

        expect(control.toggleElement).not.toBeCalled();
      });

      it('should update the element (without a viewState)', () => {
        setupControl();

        control.toggleElement = jest.fn();
        map.getView = jest.fn().mockReturnValueOnce(null);
        control.renderedVisible_ = true;
        control.updateElement();

        expect(control.toggleElement).toBeCalledWith(false);
      });
    });
  });

  describe('canvas', () => {
    it('getCanvas', () => {
      setupControl();
      const canvas = control.getCanvas();

      expect(canvas).toBeDefined();
    });

    it('export', () => {
      setupControl();
      spyOlUtilGetScale.mockReturnValueOnce(mockGetScaleResult);
      control.updateElement();

      const exportedCanvas = control.export();
      expect(exportedCanvas).toBeDefined();
    });
  });

  describe('updateScale', () => {
    let elScaleControl;

    beforeEach(() => {
      elScaleControl = document.createElement('div');
      elScaleControl.className = CSS_CLASS_SCALE;
      document.body.appendChild(elScaleControl);
    });

    it('with showScale=false', () => {
      setupControl();

      control.updateScale({
        size: 50,
        resolution: 50,
        showScale: false,
      });

      expect(elScaleControl.innerHTML).toBe('');
    });

    it('with showScale=true', () => {
      setupControl();

      control.updateScale({
        size: 50,
        resolution: 50,
        showScale: true,
      });

      expect(elScaleControl.innerHTML).toBe('M 50');
    });
  });
});

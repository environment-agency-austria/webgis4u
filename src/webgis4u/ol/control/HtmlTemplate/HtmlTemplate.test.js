import { CSS_CLASS as PanBarCssClass } from '../PanBar';
import { CSS_CLASS as ScaleLineCssClass } from '../ScaleLine';
import {
  OL_CONTROL_ZOOM_CSS_CLASS_MOUSE_POSITION,
  OL_CONTROL_ZOOM_CSS_CLASS_ZOOM,
  OL_CONTROL_ZOOM_CSS_CLASS_ZOOMSLIDER,
} from '../common';

import Control from 'ol/control/Control';
import InfoPanel from './InfoPanel/InfoPanel';
import ToolSwitcher from './ToolSwitcher/ToolSwitcher';

import * as moduleGetMapType from '../../util/getMapType';
import * as moduleToggleElement from '../../../util/dom/toggleElement';

import HtmlTemplate from '../HtmlTemplate';

jest.mock('ol/control/Control');
jest.mock('./InfoPanel/InfoPanel');
jest.mock('./ToolSwitcher/ToolSwitcher');

describe('webgis4u/ol/control/HtmlTemplate', () => {
  const spyGetMapType = jest.spyOn(moduleGetMapType, 'getMapType');
  const spyToggleElement = jest.spyOn(moduleToggleElement, 'toggleElement');

  let map;
  let elements;
  let htmlTemplate;
  let mockMapTargetElement;

  beforeEach(() => {
    mockMapTargetElement = {
      querySelector: jest.fn((selector) => {
        switch (selector) {
          case 'input[name="webgis4uDisplayMousePosition"]': return elements.mousePosCheckbox;
          case 'input[name="webgis4uScaleLine"]': return elements.scaleLineCheckbox;
          case `.${ScaleLineCssClass}`: return elements.scaleLine;
          case `.${PanBarCssClass}`: return elements.panBar;
          case `.${OL_CONTROL_ZOOM_CSS_CLASS_MOUSE_POSITION}`: return elements.mousePos;
          case `.${OL_CONTROL_ZOOM_CSS_CLASS_ZOOM}`: return elements.zoom;
          case `.${OL_CONTROL_ZOOM_CSS_CLASS_ZOOMSLIDER}`: return elements.scaleSlider;
          case '.webgis4u-map-copyright': return elements.mapCopyright;
          default: return null;
        }
      }),
    };

    map = {
      getTargetElement: jest.fn().mockReturnValue(mockMapTargetElement),
      getSize: jest.fn(() => [100, 100]),
    };

    elements = {
      mousePosCheckbox: document.createElement('input'),
      scaleLineCheckbox: document.createElement('input'),
      scaleLine: document.createElement('div'),
      panBar: document.createElement('div'),
      mousePos: document.createElement('div'),
      zoom: document.createElement('div'),
      scaleSlider: document.createElement('div'),
      mapCopyright: document.createElement('div'),
    };

    htmlTemplate = new HtmlTemplate();
  });

  afterEach(() => {
    map = null;

    spyGetMapType.mockClear();
  });

  describe('setMap', () => {
    it('should stop if map=null', () => {
      htmlTemplate.setMap(null);
      expect(map.getTargetElement).not.toBeCalled();
    });

    it('should update', () => {
      htmlTemplate.setMap(map);
      expect(map.getTargetElement).toBeCalled();
    });

    it('should not set checkboxes', () => {
      mockMapTargetElement.querySelector.mockReturnValue(null);
      htmlTemplate.setMap(map);
      expect(elements.mousePosCheckbox.onclick).toEqual(null);
      expect(elements.scaleLineCheckbox.onclick).toEqual(null);
    });
  });

  describe('updateControlsVisibility', () => {
    const mockGetMap = jest.fn();
    beforeEach(() => {
      htmlTemplate.getMap = mockGetMap;
    });
    afterEach(() => {
      mockGetMap.mockClear();
    });

    describe('should not update', () => {
      it('should do nothing without map', () => {
        mockGetMap.mockReturnValueOnce(null);
        htmlTemplate.updateControlsVisibility();
        expect(map.getSize).not.toBeCalled();
      });
      it('should do nothing without a non-large map', () => {
        mockGetMap.mockReturnValueOnce(map);
        spyGetMapType.mockReturnValueOnce('non-large');
        htmlTemplate.updateControlsVisibility();
        expect(map.getSize).not.toBeCalled();
      });
      it('should do nothing without map size', () => {
        mockGetMap.mockReturnValueOnce(map);
        spyGetMapType.mockReturnValueOnce(moduleGetMapType.MapTypeEnum.Large);
        map.getSize.mockReturnValueOnce(null);
        htmlTemplate.updateControlsVisibility();
        expect(map.getSize).toBeCalled();
        expect(htmlTemplate.toolSwitcher.updateControlsVisibility).not.toBeCalled();
      });
    });

    describe('should update', () => {
      beforeEach(() => {
        mockGetMap.mockReturnValue(map);
        spyGetMapType.mockReturnValue(moduleGetMapType.MapTypeEnum.Large);

        htmlTemplate.scaleSlider = elements.scaleSlider;
        htmlTemplate.zoom = elements.zoom;
        htmlTemplate.panBar = elements.panBar;

        htmlTemplate.mapFooter = elements.mapFooter;
        htmlTemplate.mousePos = elements.mousePos;
        htmlTemplate.scaleLine = elements.scaleLine;
        htmlTemplate.mapCopyright = elements.mapCopyright;
      });
      const MIN_NAVBAR_DISPLAYHEIGHT = 100;
      const MIN_NAVBAR_DISPLAYWIDTH = 100;
      const MIN_MAPFOOTER_DISPLAYHEIGHT = 1000;

      it('should toggle navbar', () => {
        map.getSize.mockReturnValue([MIN_NAVBAR_DISPLAYWIDTH + 1, MIN_NAVBAR_DISPLAYHEIGHT + 1]);

        htmlTemplate.updateControlsVisibility();

        expect(spyToggleElement).toBeCalledWith(elements.scaleSlider, true);
        expect(spyToggleElement).toBeCalledWith(elements.zoom, true);
        expect(spyToggleElement).toBeCalledWith(elements.panBar, true);
      });

      it('should not toggle navbar (width)', () => {
        map.getSize.mockReturnValue([MIN_NAVBAR_DISPLAYWIDTH - 1, MIN_NAVBAR_DISPLAYHEIGHT + 1]);

        htmlTemplate.updateControlsVisibility();

        expect(spyToggleElement).toBeCalledWith(elements.scaleSlider, false);
        expect(spyToggleElement).toBeCalledWith(elements.zoom, false);
        expect(spyToggleElement).toBeCalledWith(elements.panBar, false);
      });

      it('should not toggle navbar (height)', () => {
        map.getSize.mockReturnValue([MIN_NAVBAR_DISPLAYWIDTH + 1, MIN_NAVBAR_DISPLAYHEIGHT - 1]);

        htmlTemplate.updateControlsVisibility();

        expect(spyToggleElement).toBeCalledWith(elements.scaleSlider, false);
        expect(spyToggleElement).toBeCalledWith(elements.zoom, false);
        expect(spyToggleElement).toBeCalledWith(elements.panBar, false);
      });

      it('should toggle map footer', () => {
        map.getSize.mockReturnValue([100, MIN_MAPFOOTER_DISPLAYHEIGHT + 1]);

        htmlTemplate.updateControlsVisibility();

        expect(spyToggleElement).toBeCalledWith(elements.mousePos, true);
        expect(spyToggleElement).toBeCalledWith(elements.scaleLine, true);
        expect(spyToggleElement).toBeCalledWith(elements.mapCopyright, true);
      });

      it('should untoggle map footer', () => {
        map.getSize.mockReturnValue([100, MIN_MAPFOOTER_DISPLAYHEIGHT - 1]);

        htmlTemplate.updateControlsVisibility();

        expect(spyToggleElement).toBeCalledWith(elements.mousePos, false);
        expect(spyToggleElement).toBeCalledWith(elements.scaleLine, false);
        expect(spyToggleElement).toBeCalledWith(elements.mapCopyright, false);
      });
    });
  });

  describe('events', () => {
    beforeEach(() => {
      htmlTemplate.setMap(map);
    });

    it('should toggle mouse pos', () => {
      htmlTemplate.mousePosCheckbox.onchange({ target: { checked: true } });
      expect(spyToggleElement).toBeCalledWith(elements.mousePos, true);
      htmlTemplate.mousePosCheckbox.onchange({ target: { checked: false } });
      expect(spyToggleElement).toBeCalledWith(elements.mousePos, false);
    });

    it('should toggle scale line', () => {
      htmlTemplate.scaleLineCheckbox.onchange({ target: { checked: true } });
      expect(spyToggleElement).toBeCalledWith(elements.scaleLine, true);
      htmlTemplate.scaleLineCheckbox.onchange({ target: { checked: false } });
      expect(spyToggleElement).toBeCalledWith(elements.scaleLine, false);
    });
  });
});

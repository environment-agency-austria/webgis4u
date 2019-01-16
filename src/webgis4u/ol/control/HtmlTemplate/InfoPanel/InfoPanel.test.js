import InfoPanel, { CSS_CLASS, CSS_CLASS_CONTENT, CSS_CLASS_CONTROL } from './InfoPanel';

import * as moduleToggleElement from '../../../../util/dom/toggleElement';

describe('webgis4u/ol/control/HtmlTemplate/InfoPanel', () => {
  const spyGetToggledAttribute = jest.spyOn(moduleToggleElement, 'getToggledAttribute');
  const spyIsElementToggled = jest.spyOn(moduleToggleElement, 'isElementToggled');
  const spyToggleElement = jest.spyOn(moduleToggleElement, 'toggleElement');

  let infoPanel;

  let panel;
  let panelContent;
  let toggleButton;

  const mockMapWrapper = {
    querySelector: jest.fn((css) => {
      switch (css) {
        case `.${CSS_CLASS}`: return panel;
        case `.${CSS_CLASS_CONTENT}`: return panelContent;
        case `.${CSS_CLASS_CONTROL}`: return toggleButton;
        default: return null;
      }
    }),
  };

  const mockMapTargetElement = {
    parentNode: mockMapWrapper,
  };

  const map = {
    getTargetElement: jest.fn().mockReturnValue(mockMapTargetElement),
    updateSize: jest.fn(),
  };

  beforeEach(() => {
    panel = document.createElement('div');
    panel.className = CSS_CLASS;

    panelContent = document.createElement('div');
    panelContent.className = CSS_CLASS_CONTENT;

    toggleButton = document.createElement('div');
    toggleButton.className = CSS_CLASS_CONTROL;

    infoPanel = new InfoPanel();
  });

  afterEach(() => {
    panel = null;
    panelContent = null;
    toggleButton = null;

    spyGetToggledAttribute.mockClear();
    spyIsElementToggled.mockClear();
    spyToggleElement.mockClear();
  });

  describe('init', () => {
    it('should init members', () => {
      infoPanel.init(map);

      expect(infoPanel.map).toBe(map);
      expect(infoPanel.mapTargetElement).toBe(mockMapTargetElement);
      expect(infoPanel.panel).toBe(panel);
      expect(infoPanel.panelContent).toBe(panelContent);
      expect(infoPanel.toggleButton).toBe(toggleButton);
    });

    it('should toggle info', () => {
      const mockToggleInfo = jest.fn();
      infoPanel.toggleInfo = mockToggleInfo;

      spyGetToggledAttribute.mockReturnValueOnce(undefined);
      infoPanel.init(map);
      expect(mockToggleInfo).toBeCalledWith(true);

      spyGetToggledAttribute.mockReturnValueOnce(true);
      infoPanel.init(map);
      expect(mockToggleInfo).toBeCalledWith(true);

      spyGetToggledAttribute.mockReturnValueOnce(false);
      infoPanel.init(map);
      expect(mockToggleInfo).toBeCalledWith(false);
    });

    it('should abort if elements are not available', () => {
      mockMapWrapper.querySelector.mockReturnValueOnce(null);
      infoPanel.init(map);

      expect(spyToggleElement).not.toBeCalled();
    });
  });

  describe('isInfoShown', () => {
    it('should call/return isElementToggled', () => {
      infoPanel.init(map);

      spyIsElementToggled.mockReturnValue(true);
      const r = infoPanel.isInfoShown();

      expect(spyIsElementToggled).toBeCalledTimes(1);
      expect(spyIsElementToggled).toBeCalledWith(infoPanel.panel);
      expect(r).toBe(true);
    });
  });

  describe('toggleInfo', () => {
    it('should toggle/update', () => {
      infoPanel.init(map);
      map.updateSize.mockClear();

      infoPanel.toggleInfo(true);
      expect(spyToggleElement).toBeCalledWith(infoPanel.panel, true);

      infoPanel.toggleInfo(false);
      expect(spyToggleElement).toBeCalledWith(infoPanel.panel, false);

      expect(map.updateSize).toBeCalledTimes(2);
    });
  });

  describe('toggleButton click', () => {
    it('should toggle', () => {
      infoPanel.init(map);
      spyToggleElement.mockClear();
      infoPanel.toggleButton.onclick({});
      expect(spyToggleElement).toBeCalledTimes(1);
    });
  });
});

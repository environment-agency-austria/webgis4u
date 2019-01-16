import ToolSwitcher from './ToolSwitcher';

describe('webgis4u/ol/control/HtmlTemplate/ToolSwitcher', () => {
  let toolSwitcher;

  let toolsSwitcherContent;
  let toolsSwitcherSlider;
  let closeButton;

  let toolElements;

  let mockMapTargetElement;

  /**
   * Initialize mock elements
   */
  const createMockElement = (name) => {
    const button = document.createElement('div');
    const content = document.createElement('div');

    button.setAttribute('data-id', name);
    content.setAttribute('data-id', name);
    content.className = 'webgis4u-toolswitcher-content-item';

    toolsSwitcherSlider.appendChild(button);
    toolsSwitcherContent.appendChild(content);

    return { button, content };
  };

  beforeEach(() => {
    mockMapTargetElement = {
      querySelector: jest.fn((selector) => {
        switch (selector) {
          case '.webgis4u-toolswitcher-content': return toolsSwitcherContent;
          case '.webgis4u-toolswitcher-sliders': return toolsSwitcherSlider;
          case '.webgis4u-toolswitcher-close': return closeButton;
          default: return null;
        }
      }),
    };

    toolsSwitcherContent = document.createElement('div');
    toolsSwitcherSlider = document.createElement('div');
    closeButton = document.createElement('div');

    toolElements = {
      map: createMockElement('map'),
      functions: createMockElement('functions'),
    };

    toolSwitcher = new ToolSwitcher();
  });

  afterEach(() => {
    mockMapTargetElement = null;
    toolsSwitcherContent = null;
    toolsSwitcherSlider = null;
    closeButton = null;
    toolElements = null;
    toolSwitcher = null;
  });

  describe('init', () => {
    it('should set members', () => {
      toolSwitcher.init(mockMapTargetElement);

      expect(toolSwitcher.toolsSwitcherContent).toBe(toolsSwitcherContent);
      expect(toolSwitcher.toolsSwitcherSlider).toBe(toolsSwitcherSlider);
      expect(toolSwitcher.closeButton).toBe(closeButton);
    });

    it('should not init panel', () => {
      toolsSwitcherContent = null;
      toolSwitcher.initPanel = jest.fn();
      toolSwitcher.init(mockMapTargetElement);
      expect(toolSwitcher.initPanel).not.toBeCalled();
    });

    describe('initPanel', () => {
      it('should init', () => {
        toolSwitcher.init(mockMapTargetElement);
        expect(toolElements.map.button.onclick).toBeDefined();
        expect(toolElements.functions.button.onclick).toBeDefined();
      });

      it('should skip init for non existing', () => {
        toolSwitcher.init(mockMapTargetElement);
        toolSwitcher.initPanel(['something']);
        expect(toolElements.map.button.onclick).toBeDefined();
        expect(toolElements.functions.button.onclick).toBeDefined();
      });
    });
  });

  describe('getToolElements', () => {
    it('should return correct result', () => {
      toolSwitcher.init(mockMapTargetElement);

      const rMap = toolSwitcher.getToolElements('map');
      expect(rMap).toMatchObject(toolElements.map);
      const rFunctions = toolSwitcher.getToolElements('functions');
      expect(rFunctions).toMatchObject(toolElements.functions);
    });

    it('should return null if tool does not exist', () => {
      toolSwitcher.init(mockMapTargetElement);
      expect(toolSwitcher.toolsSwitcherContent).toBe(toolsSwitcherContent);

      const r = toolSwitcher.getToolElements('non-existing');
      expect(r).toBe(null);
    });

    it('should return null', () => {
      toolSwitcher.init(mockMapTargetElement);
      toolSwitcher.toolsSwitcherContent = null;

      const r = toolSwitcher.getToolElements('map');
      expect(r).toBe(null);
    });
  });

  describe('activateTool', () => {
    it('should activate', () => {
      toolSwitcher.init(mockMapTargetElement);
      toolSwitcher.activateTool('map');
      expect(toolSwitcher.activeTool).toBe('map');
    });

    it('should not activate non existing tools', () => {
      toolSwitcher.init(mockMapTargetElement);
      toolSwitcher.activateTool('mock');
      expect(toolSwitcher.activeTool).toBe(null);
    });

    it('should deactiavte and activate', () => {
      toolSwitcher.init(mockMapTargetElement);
      toolSwitcher.activateTool('map');

      toolSwitcher.deactivateTool = jest.fn();

      toolSwitcher.activateTool('functions');
      expect(toolSwitcher.deactivateTool).toBeCalledWith('map');
      expect(toolSwitcher.activeTool).toBe('functions');
    });
  });

  describe('deactivateTool', () => {
    it('should deactivate', () => {
      toolSwitcher.init(mockMapTargetElement);
      toolSwitcher.deactivateTool('map');
      expect(toolSwitcher.activeTool).toBe(null);
    });

    it('should do nothing', () => {
      toolSwitcher.init(mockMapTargetElement);

      toolSwitcher.activeTool = 'map';
      toolSwitcher.deactivateTool('mock');
      expect(toolSwitcher.activeTool).toBe('map');
    });
  });

  describe('closeMenu', () => {
    it('should deactivate and update style', () => {
      toolSwitcher.init(mockMapTargetElement);
      toolSwitcher.deactivateTool = jest.fn();
      const activeTool = 'map';
      toolSwitcher.activeTool = activeTool;

      toolSwitcher.closeMenu();
      expect(toolSwitcher.deactivateTool).toBeCalledWith(activeTool);
      expect(toolsSwitcherContent.getAttribute('data-expanded')).toBe('false');
    });
  });

  describe('updateControlsVisibility', () => {
    it('should update toolsSwitcherContent', () => {
      const options = { size: [100, 100] };
      toolSwitcher.init(mockMapTargetElement);
      const before = toolsSwitcherContent.style.maxHeight;
      toolSwitcher.updateControlsVisibility(options);
      expect(before).not.toBe(toolsSwitcherContent.style.maxHeight);
    });

    it('should not update toolsSwitcherContent', () => {
      const options = { size: [100, 100] };
      toolSwitcher.init(mockMapTargetElement);
      const before = toolsSwitcherContent.style.maxHeight;
      toolSwitcher.toolsSwitcherContent = null;
      toolSwitcher.updateControlsVisibility(options);
      expect(before).toBe(toolsSwitcherContent.style.maxHeight);
    });
  });

  describe('close button', () => {
    it('onclick should close', () => {
      toolSwitcher.init(mockMapTargetElement);
      toolSwitcher.closeMenu = jest.fn();
      toolSwitcher.closeButton.onclick();
      expect(toolSwitcher.closeMenu).toBeCalled();
    });
  });

  describe('tool button', () => {
    it('should activate', () => {
      toolSwitcher.init(mockMapTargetElement);
      toolSwitcher.activateTool = jest.fn();
      toolSwitcher.closeMenu = jest.fn();

      toolElements.map.button.onclick({});

      expect(toolSwitcher.closeMenu).not.toBeCalled();
      expect(toolSwitcher.activateTool).toBeCalledWith('map');
    });

    it('should close if active', () => {
      toolSwitcher.init(mockMapTargetElement);
      toolSwitcher.activateTool = jest.fn();
      toolSwitcher.closeMenu = jest.fn();

      toolSwitcher.activeTool = 'map';
      toolElements.map.button.onclick({});

      expect(toolSwitcher.activateTool).not.toBeCalled();
      expect(toolSwitcher.closeMenu).toBeCalled();
    });
  });
});

import { createElement } from './createElement';

describe('webgis4u/util/dom/createElement', () => {
  /**
   * Default setup
   * @param {module:webgis4u/util/dom/createElement~CreateHtmlElementOptions} options
   * The options for createElement
   *
   * @returns {HTMLElement} An html element
   */
  const setup = (options) => {
    return createElement({
      tag: 'div',
      ...options,
    });
  };

  // ==================================================
  // Option: tag
  // ==================================================
  describe('option [tag]', () => {
    it('should create element if tag is passed', () => {
      const e = createElement({ tag: 'div' });
      expect(e).toBeDefined();
    });

    it('should fail on non string tag', () => {
      expect(() => {
        createElement({ tag: [] });
      }).toThrowError();
    });
  });

  // ==================================================
  // Option: cssClass
  // ==================================================
  describe('options [cssClass]', () => {
    it('should set class', () => {
      const cssClass = 'test';
      const e = setup({ cssClass });
      expect(e.className).toBe(cssClass);
    });

    const testCasesOmit = [
      ['undefined', undefined],
      ['null', null],
      ['string ("")', ''],
    ];

    test.each(testCasesOmit)('for (%s)', (name, cssClass) => {
      const e = setup({ cssClass });
      expect(e.className).toBe('');
    });
  });
});

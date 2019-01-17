import { getToggledAttribute, isElementToggled, toggleElement } from './toggleElement';

describe('webgis4u/util/dom/toggleElement', () => {
  const ATTRIBUTE = 'data-visible';
  let element;

  beforeEach(() => {
    element = document.createElement('div');
  });

  const setupWith = (value) => {
    if (typeof(value) === 'boolean') {
      element.setAttribute(ATTRIBUTE, value);
    }
  };


  describe('getToggledAttribute', () => {
    const testCases = [
      [undefined, undefined],
      [false, false],
      [true, true],
    ];

    test.each(testCases)('for attribute value=%s to be %s', (attributeValue, expected) => {
      setupWith(attributeValue);
      const r = getToggledAttribute(element);
      expect(r).toBe(expected);
    });
  });

  describe('isElementToggled', () => {
    const testCases = [
      [undefined, false],
      [false, false],
      [true, true],
    ];

    test.each(testCases)('for attribute value=%s to be %s', (attributeValue, expected) => {
      setupWith(attributeValue);
      const r = isElementToggled(element);
      expect(r).toBe(expected);
    });
  });

  describe('toggleElement', () => {
    const testCases = [
      // Initial 'false'
      [false, false, 'false'],
      [false, true, 'true'],
      [false, undefined, 'true'],
      // Initial 'true'
      [true, false, 'false'],
      [true, true, 'true'],
      [true, undefined, 'false'],
      // Initial 'undefined'

      [undefined, false, 'false'],
      [undefined, true, 'true'],
      [undefined, undefined, 'true'],
    ];

    test.each(testCases)('for (value=%s, toggle=%s) to result in %s', (attributeValue, toggle, expected) => {
      setupWith(attributeValue);
      toggleElement(element, toggle);
      expect(element.getAttribute(ATTRIBUTE)).toBe(expected);
    });
  });

  // // ==================================================
  // // Option: tag
  // // ==================================================
  // describe('option [tag]', () => {
  //   it('should create element if tag is passed', () => {
  //     const e = createElement({ tag: 'div' });
  //     expect(e).toBeDefined();
  //   });

  //   it('should fail on non string tag', () => {
  //     expect(() => {
  //       createElement({ tag: [] });
  //     }).toThrowError();
  //   });
  // });

  // // ==================================================
  // // Option: cssClass
  // // ==================================================
  // describe('options [cssClass]', () => {
  //   it('should set class', () => {
  //     const cssClass = 'test';
  //     const e = setup({ cssClass });
  //     expect(e.className).toBe(cssClass);
  //   });

  //   const testCasesOmit = [
  //     ['undefined', undefined],
  //     ['null', null],
  //     ['string ("")', ''],
  //   ];

  //   test.each(testCasesOmit)('for (%s)', (name, cssClass) => {
  //     const e = setup({ cssClass });
  //     expect(e.className).toBe('');
  //   });
  // });

  // // ==================================================
  // // Option: width
  // // ==================================================
  // describe('options [width]', () => {
  //   it('should be set', () => {
  //     const width = '20px';
  //     const e = setup({ width });
  //     expect(e.style.width).toBe(width);
  //   });

  //   const testCasesOmit = [
  //     ['undefined', undefined],
  //     ['null', null],
  //     ['string ("")', ''],
  //   ];

  //   test.each(testCasesOmit)('for (%s)', (name, width) => {
  //     const e = setup({ width });
  //     expect(e.style.width).toBe('');
  //   });
  // });

  // // ==================================================
  // // Option: height
  // // ==================================================
  // describe('options [height]', () => {
  //   it('should be set', () => {
  //     const height = '20px';
  //     const e = setup({ height });
  //     expect(e.style.height).toBe(height);
  //   });

  //   const testCasesOmit = [
  //     ['undefined', undefined],
  //     ['null', null],
  //     ['string ("")', ''],
  //   ];

  //   test.each(testCasesOmit)('for (%s)', (name, height) => {
  //     const e = setup({ height });
  //     expect(e.style.height).toBe('');
  //   });
  // });
});

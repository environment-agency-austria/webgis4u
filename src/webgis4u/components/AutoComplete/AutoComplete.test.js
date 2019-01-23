import AutoComplete from '../AutoComplete';
import KeyCodeEnum from '../../util/dom/KeyCodeEnum';

describe('webgis4u/components/AutoComplete', () => {
  /**
   * @type {HTMLInputElement}
   */
  let element;
  /**
   * @type {module:webgis4u/components/AutoComplete~AutoComplete}
   */
  let control;

  /**
   *
   * @param {*} options
   */
  const setupControl = (options) => {
    control = new AutoComplete({
      element,
      ...options,
    });
  };

  beforeEach(() => {
    const elementParent = document.createElement('div');
    element = document.createElement('input');
    element.setAttribute('type', 'text');
    elementParent.appendChild(element);
    document.body.appendChild(elementParent);
  });

  describe('with invalid options', () => {
    it('with invalid source', async () => {
      setupControl({
        source: { something: null },
      });

      await expect(control.getSource('test')).rejects.toThrowError();
    });
  });

  describe('with sync source', () => {
    const messageNotFound = 'NOT FOUND';
    const messagePending = 'PENDING';
    const onListUpdated = jest.fn();
    const onItemSelected = jest.fn();
    const onItemHover = jest.fn();
    const source = ['test1', 'test2', 'no-value'];

    beforeEach(() => {
      onListUpdated.mockClear();
      onItemSelected.mockClear();
      onItemHover.mockClear();

      setupControl({
        source,
        onListUpdated,
        onItemSelected,
        onItemHover,
        messages: {
          notFound: messageNotFound,
          pending: messagePending,
        },
      });
    });

    it('without a value', () => {
      const spyOnGetSource = jest.spyOn(control, 'getSource');
      control.handleOnInput();
      expect(spyOnGetSource).not.toBeCalled();
    });

    it('without founded choices', async () => {
      // Simulate input event
      await control.updateList('1234');

      expect(control.filteredChoices).toBeDefined();
      expect(control.filteredChoices.length).toBe(0);
      // Check if the 'NOT FOUND' element is added
      expect(control.list).toBeDefined();
      expect(control.list.children).toBeDefined();
      expect(control.list.children.length).toBe(1);
      expect(control.list.children[0].innerHTML).toMatch(messageNotFound);
    });

    it('should prepare filteredChoices', async () => {
      // Simulate input event
      await control.updateList('test');

      expect(control.list).toBeDefined();
      expect(control.filteredChoices).toBeDefined();
      expect(control.filteredChoices.length).toBe(2);

      expect(onListUpdated).toBeCalledWith([source[0], source[1]]);
    });

    it('should prepare filteredChoices with limit', async () => {
      control.limit = 1;
      // Simulate input event
      await control.updateList('test');

      expect(control.list).toBeDefined();
      expect(control.filteredChoices).toBeDefined();
      expect(control.filteredChoices.length).toBe(control.limit);
    });

    describe('should handle events', () => {
      beforeEach(async () => {
        await control.updateList('test');
        expect(control.filteredChoices).toBeDefined();
        expect(control.filteredChoices.length).toBe(2);
      });

      it('mouse over item', async () => {
        control.list.children[0].dispatchEvent(new Event('mouseover'));
        expect(onItemHover).toBeCalledTimes(1);
      });

      it('key down', async () => {
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ARROW_DOWN });
        expect(control.currentFocus).toBe(0);
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ARROW_DOWN });
        expect(control.currentFocus).toBe(1);
        // And without the onItemHover
        control.onItemHover = null;
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ARROW_DOWN });
        expect(control.currentFocus).toBe(0);

        expect(onItemHover).toBeCalledTimes(2);
      });

      it('key up', async () => {
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ARROW_UP });
        expect(control.currentFocus).toBe(1);
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ARROW_UP });
        expect(control.currentFocus).toBe(0);
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ARROW_UP });
        expect(control.currentFocus).toBe(1);

        expect(onItemHover).toBeCalledTimes(3);
      });

      it('key enter', async () => {
        const preventDefault = jest.fn();

        // Focus on element at index 0
        control.currentFocus = 0;
        // Call once with onItemSelected
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ENTER, preventDefault });
        // And without the onItemSelected
        control.onItemSelected = null;
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ENTER, preventDefault });

        // Check expected results
        expect(control.element.value).toBe(control.filteredChoices[control.currentFocus]);
        expect(preventDefault).toBeCalledTimes(2);
        expect(onItemSelected).toBeCalledTimes(1);

        // Focus on invalid element
        onItemSelected.mockClear();
        control.currentFocus = -1;
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ENTER, preventDefault });
        expect(onItemSelected).not.toBeCalled();
      });

      it('key should not handle', async () => {
        // Without valid key
        control.handleOnKeydown({ keyCode: 654654 });
        expect(control.currentFocus).toBe(-1);
        // Without list items
        control.list.innerHTML = '';
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ARROW_DOWN });
        expect(control.currentFocus).toBe(-1);
        // Without a list
        control.list = null;
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ARROW_DOWN });
        expect(control.currentFocus).toBe(-1);
        // Without empty filtered choices
        control.filteredChoices = [];
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ARROW_DOWN });
        expect(control.currentFocus).toBe(-1);
        // Without filtered choices
        control.filteredChoices = null;
        control.handleOnKeydown({ keyCode: KeyCodeEnum.ARROW_DOWN });
        expect(control.currentFocus).toBe(-1);
      });
    });
  });

  describe('with async source', () => {
    const getSourceResult = [{ value: 'test1' }, { value: 'test2' }];
    let resolvePromise;
    let mockGetSource;

    beforeEach(() => {
      mockGetSource = (() => {
        return new Promise((resolve) => {
          resolvePromise = resolve;
        });
      });

      setupControl({
        source: mockGetSource,
        getChoiceText: choice => choice.value,
      });
    });

    it('should acquire results', async () => {
      const spyOnCreatePending = jest.spyOn(control, 'createPending');
      const p = control.updateList('test');

      // Resolve
      resolvePromise(getSourceResult);
      await p;

      // Check results
      expect(spyOnCreatePending).toBeCalled();
      expect(control.filteredChoices.length).toBe(2);
    });
  });

  describe('with 2 lists', () => {
    let control2;
    let element2;

    const source = ['test1', 'test2', 'no-value'];

    beforeEach(() => {
      element2 = document.createElement('input');
      element2.setAttribute('type', 'text');
      document.body.appendChild(element2);

      setupControl({
        element: element2,
        source,
      });
      control2 = control;

      setupControl({
        source,
      });
    });

    it('should close one list', async () => {
      // Simulate input event
      await control.updateList('test');
      element.parentNode.click();
      expect(control).not.toBe(control2);
    });
  });
});

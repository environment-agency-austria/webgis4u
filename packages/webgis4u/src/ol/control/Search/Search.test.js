import { disposeMap, createMap } from '../../../../test/utils/ol';
import AutoComplete from '../../../components/AutoComplete';
import * as moduleAsyncDebounce from '../../../util/promise/asyncDebounce';
import * as moduleSendRequest from '../../../util/web/sendRequest';

import Search from '../Search';

jest.mock('../../../components/AutoComplete');

describe('webgis4u/ol/control/Search', () => {
  let map;
  let control;
  let mockElement;

  const mockResult = [{
    value: 'Somewhere',
    data: {
      type: 'Feature',
      crs: {
        type: 'name',
        properties: { name: 'EPSG:31287' },
      },
      geometry: {
        type: 'Point',
        coordinates: [604373.0, 432958.0],
      },
      properties: {
        lid: 'geonames.org',
        fid: '138733',
      },
    },
  }];

  // Create spies
  const spySendRequest = jest.spyOn(moduleSendRequest, 'sendRequest');
  const spyAsyncDebounce = jest.spyOn(moduleAsyncDebounce, 'asyncDebounce');

  // Provide spy implementations
  spyAsyncDebounce.mockImplementation(fn => fn);
  spySendRequest.mockImplementation((options) => {
    options.success(mockResult);
  });

  /**
   * Set up the control
   */
  const setupControl = (options) => {
    control = new Search(options);
    map.addControl(control);
  };

  beforeEach(() => {
    //
    mockElement = document.createElement('input');
    mockElement.setAttribute('name', 'webgis4uSearchField');
    document.body.appendChild(mockElement);

    // Create the map
    map = createMap();
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
    control = null;
    document.getElementsByTagName('html')[0].innerHTML = '';
    // Set back mocks
    spySendRequest.mockClear();
  });

  describe('should contain control', () => {
    it('with an element inside the map', () => {
      setupControl();
      expect(map.getControls().getArray()).toContain(control);
    });

    it('do nothing on map=null', () => {
      setupControl();
      const spyInitLayers = jest.spyOn(control, 'initLayers');
      control.setMap(null);
      expect(spyInitLayers).not.toBeCalled();
    });

    it('do noting on searchField not found', () => {
      setupControl();
      const spyInitLayers = jest.spyOn(control, 'initLayers');
      control.searchFieldSelector = '.something-that-does-not-exist';
      control.setMap(map);
      expect(spyInitLayers).not.toBeCalled();
    });
  });

  describe('getter', () => {
    beforeEach(() => {
      setupControl();
    });

    it('getSearchOverlay', () => {
      const value = 'test';
      control._searchOverlay = value;
      expect(control.getSearchOverlay()).toBe(value);
    });

    it('getSearchResult', () => {
      const value = 'test';
      control.layerSearchResults = value;
      expect(control.getSearchResult()).toBe(value);
    });
  });

  describe('getFilteredList', () => {
    const mockPreprocessQuery = jest.fn((query, map) => 'url');

    beforeEach(() => {
      setupControl({
        preprocessQuery: mockPreprocessQuery,
      });
    });

    it('should resolve', async () => {
      const p = control.getFilterdList('url', map, 'query');
      const r = await p;

      expect(r).toEqual(mockResult);
    });

    it('should resolve empty', async () => {
      spySendRequest.mockImplementationOnce((options) => {
        options.error([]);
      });

      const p = control.getFilterdList('url', map, 'query');
      const r = await p;
      expect(r).toEqual([]);
    });
  });

  describe('showSearchResults', () => {
    beforeEach(() => {
      setupControl({
      });
    });

    it('should show results', () => {
      control.showSearchResults(mockResult);
    });
  });

  describe('with AutoComplete', () => {
    let autoComplete;

    beforeEach(() => {
      AutoComplete.mockImplementation((options) => {
        autoComplete = options;
        return autoComplete;
      });

      setupControl({
      });
    });

    it('should get source', () => {
      const spy = jest.spyOn(control, 'getFilterdList');
      autoComplete.source('test');
      expect(spy).toBeCalled();
    });

    it('should select items', () => {
      const spy = jest.spyOn(control, 'onSelect');
      autoComplete.onItemSelected({}, mockResult[0]);
      expect(spy).toBeCalled();
    });

    it('should hover items', () => {
      const spy = jest.spyOn(control, 'onHover');
      autoComplete.onItemHover({}, mockResult[0]);
      expect(spy).toBeCalled();
    });

    it('should update list', () => {
      const spy = jest.spyOn(control, 'showSearchResults');
      autoComplete.onListUpdated(mockResult);
      expect(spy).toBeCalled();
      expect(control.getSuggestions()).toEqual(mockResult);
    });

    it('should get choice text', () => {
      const r = autoComplete.getChoiceText(mockResult[0]);
      expect(r).toBe(mockResult[0].value);
    });
  });
});

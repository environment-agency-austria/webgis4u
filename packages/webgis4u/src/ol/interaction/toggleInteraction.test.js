import { toggleInteraction } from './toggleInteraction';

describe('webgis4u/ol/interaction/toggleInteraction', () => {
  const mockMap = {
    addInteraction: jest.fn(),
    removeInteraction: jest.fn(),
  };
  const mockInteraction = jest.fn();

  it('should add interaction', () => {
    toggleInteraction(mockMap, mockInteraction, true);

    expect(mockMap.addInteraction).toBeCalledWith(mockInteraction);
  });

  it('should remove interaction', () => {
    toggleInteraction(mockMap, mockInteraction, false);

    expect(mockMap.removeInteraction).toBeCalledWith(mockInteraction);
  });
});

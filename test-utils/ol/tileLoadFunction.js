import Tile from 'ol/Tile';

/**
 * Mocks loading a tile
 */
export const tileLoadFunction = () => {
  const tile = new Tile([0, 0, -1], 2 /* LOADED */);
  tile.getImage = () => {
    const image = new Image();
    image.width = 256;
    image.height = 256;
    return image;
  };
  return tile;
};

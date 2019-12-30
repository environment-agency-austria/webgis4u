/**
 * @typedef {module:ol/map~Map} Map
 */
/**
 * @typedef {module:ol/interaction~Interaction} Interaction
 */

/**
 * Toogles the given control for the given map.
 *
 * @param {Map} map The map
 * @param {Interaction} interaction The control
 * @param {boolean} isActive If TRUE, the control will be added to the map
 */
export function toggleInteraction(map, interaction, isActive) {
  if (isActive) {
    map.addInteraction(interaction);
  } else {
    map.removeInteraction(interaction);
  }
}

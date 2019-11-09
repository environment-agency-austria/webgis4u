const { readFileSync } = require('fs');

const ENCODING = 'utf8';

/**
 * Read the contents from the folder
 */
function getTemplatesFromFolder(options) {
  const { folder } = options;

  const copyright = readFileSync(`${folder}/copyright.html`, ENCODING);
  const cardMenu = readFileSync(`${folder}/card_menu.html`, ENCODING);
  const linkPanel = readFileSync(`${folder}/link_panel.html`, ENCODING);
  const toolSwitcherFunctions = readFileSync(`${folder}/tool_switcher_functions.html`, ENCODING);
  const toolSwitcherLayers = readFileSync(`${folder}/tool_switcher_layers.html`, ENCODING);
  const infoPanelHeader = readFileSync(`${folder}/info_panel_header.html`, ENCODING);
  const infoPanelFooter = readFileSync(`${folder}/info_panel_footer.html`, ENCODING);
  const legend = readFileSync(`${folder}/legend.html`, ENCODING);

  return {
    copyright,
    card_menu: cardMenu,
    link_panel: linkPanel,
    tool_switcher_functions: toolSwitcherFunctions,
    tool_switcher_layers: toolSwitcherLayers,
    info_panel_header: infoPanelHeader,
    info_panel_footer: infoPanelFooter,
    legend,
  };
}

module.exports = {
  getTemplatesFromFolder,
};

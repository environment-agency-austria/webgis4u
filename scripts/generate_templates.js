/* eslint-disable no-console */

const fs = require('fs');
const { parseTemplates } = require('./parseTemplate');

const ENCODING = 'utf8';


/**
 *
 */
function getTemplatesFromFolder(options) {
  const { folder } = options;

  const copyright = fs.readFileSync(`${folder}/copyright.html`, ENCODING);
  const cardMenu = fs.readFileSync(`${folder}/card_menu.html`, ENCODING);
  const linkPanel = fs.readFileSync(`${folder}/link_panel.html`, ENCODING);
  const toolSwitcherFunctions = fs.readFileSync(`${folder}/tool_switcher_functions.html`, ENCODING);
  const toolSwitcherLayers = fs.readFileSync(`${folder}/tool_switcher_layers.html`, ENCODING);
  const infoPanelHeader = fs.readFileSync(`${folder}/info_panel_header.html`, ENCODING);
  const infoPanelFooter = fs.readFileSync(`${folder}/info_panel_footer.html`, ENCODING);
  const legend = fs.readFileSync(`${folder}/legend.html`, ENCODING);

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

const distFolder = './dist';
const srcFolder = './src';

/* The basic template files */
const templates = [
  `${srcFolder}/pug/templates/embedded.template.pug`,
  `${srcFolder}/pug/templates/large.template.pug`,
  `${srcFolder}/pug/templates/popup.template.pug`,
];

parseTemplates({
  files: templates,
  params: {
    pretty: false,
  },
  out: `${distFolder}/templates`,
});

parseTemplates({
  files: templates,
  params: {
    pretty: false,
    ...getTemplatesFromFolder({ folder: `${srcFolder}/html_fragment` }),
  },
  out: `${distFolder}/template_examples`,
});

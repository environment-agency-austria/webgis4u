const fs = require('fs');
const { parseTemplates } = require('./parseTemplate');
const { getTemplatesFromFolder } = require('./getTemplatesFromFolder');

console.log('webgis4u cli');

/**
 * Prints message, usage and exists the process
 * @param {string} message
 */
function exitWithUsage(message) {
  console.error(message);
  console.log('usage: webgis4u -out <path> -templates <path>');
  process.exitCode(1);
}

// ================================================================================================
// Make sure that the parameters passed to the script are correct
// ================================================================================================
const [,, outFlag, out, templatesFlag, folder] = process.argv;
if (outFlag !== '-out') {
  exitWithUsage(`Unknown flag ${outFlag}`);
  return;
}
if (templatesFlag && templatesFlag !== '-templates') {
  exitWithUsage(`Unknown flag ${templatesFlag}`);
  return;
}
if (templatesFlag && !fs.existsSync(folder)) {
  exitWithUsage(`-templates option must be an existing folder. Folder does not exist: ${folder}`);
  return;
}

// ================================================================================================
// Now actually parse the files
// ================================================================================================
/**
 * Source folder
 */
const pugFolder = './pug';

/* The basic template files */
const templates = [
  `${pugFolder}/embedded.template.pug`,
  `${pugFolder}/large.template.pug`,
  `${pugFolder}/popup.template.pug`,
];

const additionalParams = folder
  ? getTemplatesFromFolder({ folder })
  : undefined;

parseTemplates({
  files: templates,
  params: {
    pretty: false,
    ...additionalParams,
  },
  out,
});

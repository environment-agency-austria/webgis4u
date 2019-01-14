/* eslint-disable no-console */

const fs = require('fs');
const { basename } = require('path');
const mkdirp = require('mkdirp');
const pug = require('pug');

/**
 * Write generated template results in the target folder with the file extension '.html'
 * @param {object} options The options.
 * @param {Array<string>} options.files The pug template files.
 * @param {object} options.params The pug parameters.
 * @param {string} options.out The target folder.
 */
function parseTemplates(options) {
  const { files, params, out: targetFolder } = options;
  console.debug(`generating templates in ${targetFolder}`);

  let folderCreated = false;
  if (!fs.existsSync(targetFolder)) {
    console.debug('Folder does not exist');
    mkdirp.sync(targetFolder);
    folderCreated = true;
    console.debug(`Created ${targetFolder}`);
  }

  // Parse each passed template file
  files.forEach((pugFile) => {
    const newFilename = `${basename(pugFile, '.pug')}.html`;
    const filepath = `${targetFolder}/${newFilename}`;

    console.debug(`Rendering ${pugFile} -> ${filepath}`);

    if (!folderCreated && fs.existsSync(filepath)) {
      // If the file already exists, remove it first
      console.debug(`Removing existing ${filepath}`);
      fs.unlinkSync(filepath);
    }

    const html = pug.renderFile(pugFile, params);
    fs.writeFileSync(filepath, html);
    console.debug(`Created ${filepath}`);
  });
}


module.exports = {
  parseTemplates,
};

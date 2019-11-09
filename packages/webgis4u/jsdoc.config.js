/**
 * Configuration for `jsdoc`
 * @see http://usejsdoc.org/about-configuring-jsdoc.html
 */
module.exports = {
  source: {
    include: ['src'],
    includePattern: '.+\\.js(doc|x)?$',
    excludePattern: '.+\\.test.js$',
  },
  sourceType: 'module',
  opts: {
    // template: 'templates/default', // same as -t templates/default
    encoding: 'utf8', // same as -e utf8
    destination: './doc/', // same as -d ./out/
    recurse: true, // same as -r
  },
  templates: {
    cleverLinks: true,
    monospaceLinks: false,
  },
};

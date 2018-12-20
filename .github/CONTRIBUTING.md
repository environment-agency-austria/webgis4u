# How to contribute

## Tools
The project uses a set of tools that should help developing stable and maintainable software.
This tools are configured so that they can be used on your locale machine.

Tool | Configuration | Website
---- | ------------- | -------
Babel 7.1 | [babel.config.js](./babel.config.js) | https://babeljs.io
Webpack 4 | [webpack.config.js](./webpack.config.js) | https://webpack.js.org/
Jest 23.6 | [jest.config.js](./jest.config.js) | https://jestjs.io/
JSDoc | [jsdoc.config.js](./jsdoc.config.js) | http://usejsdoc.org/
ESlint | [.eslintrc.json](./.eslintrc.json) | https://eslint.org/

## CI/CD Tools
Furthermore there are tools that are running online that should help out with different things.

### [Travis CI](https://travis-ci.com/environment-agency-austria/webgis4u.svg?branch=master)
Used as an automated build pipeline and configured in [.travis.yml](./.travis.yml).

### [Coveralls](https://coveralls.io/repos/github/environment-agency-austria/webgis4u/badge.svg?branch=master)
Keeps track of the code coverage in the project. The data shown is provided by the corresponding `Travis CI` step.

### [Greenkeeper](https://badges.greenkeeper.io/environment-agency-austria/webgis4u.svg)
Automatically tests dependency updates inside the valid version range based on package.json and creates GitHub issues if any errors occur.

## Useful commands
* `$> yarn build` - creates a production build
* `$> yarn start` - starts webpack in watch mode. Automatically recompiles when changes in the source are detected.
* `$> yarn test` - runs the unit tests.
* `$> yarn test:watch` - starts jest in watch mode. Runs the affected unit tests when changes in the source are detected.
* `$> yarn test:coverage` - runs the unit tests and reports the code coverage in the console window and in coverage/lcov-report/index.html
* `$> yarn lint` - manually runs the linter

## Deploy a new version
Only the maintainers of the repo can deploy a new version

### Deploy a regular release
1. Make sure that you are on the `master` branch
2. Figure out what the `<new-version-number>` will be
3. Update the [changelog](./CHANGELOG.md) so that all the yet unreleased changes are grouped under the `<new-version-number>`
4. Run: `$> git commit -m "doc: updated changelog"`
5. Run: `$> yarn version --new-version <new-version-number>"`
6. Run: `$> git push`
7. Run: `$> git push --tags`
8. Go to the GitHub Releases and create a new release from the pushed tag and with the `<new-version-number>` and include the changes from the changelog

### Deploy a tagged npm release
This is useful if you would like to create a `next` or `beta` release.

1. Run: `$> yarn publish . --tag <tag-name>`

## Recommended development setup
1. Prepare your local devtools.
    * [Visual Studio Code](https://code.visualstudio.com/)
    * [node.js](https://nodejs.org/en/) (LTS version is recommended)
    * [yarn](https://yarnpkg.com/lang/en/) via `npm install -g yarn`
1. Create a GitHub account and get assigned to the environment-agency-austria organization by [@thomas-eaa](https://github.com/thomas-eaa)
2. Clone the repo locally by running `git clone https://github.com/environment-agency-austria/webgis4u.git`
3. Install the recommended Visual Studio Code plugins (eslint, gitflow, GitLens)
4. Install dependencies via `yarn` (without parameters)
5. Edit code, run tests, build, ...

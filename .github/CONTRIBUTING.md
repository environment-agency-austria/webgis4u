# How to contribute

## Tools
The project uses a set of tools that should help developing stable and maintainable software.
This tools are configured so that they can be used on your locale machine.

Tool | Configuration | Website
---- | ------------- | -------
Babel | [babel.config.js](./babel.config.js) | https://babeljs.io
Webpack | [webpack.config.js](./webpack.config.js) | https://webpack.js.org/
Jest | [jest.config.js](./jest.config.js) | https://jestjs.io/
JSDoc | [jsdoc.config.js](./jsdoc.config.js) | http://usejsdoc.org/
ESlint | [.eslintrc.json](./.eslintrc.json) | https://eslint.org/
Lerna | [lerna.json](./lerna.json) | https://lerna.js.org/

## CI/CD Tools
Furthermore there are tools that are running online that should help out with different things.

### [Travis CI](https://travis-ci.com/environment-agency-austria/webgis4u.svg?branch=master)
Used as an automated build pipeline and configured in [.travis.yml](./.travis.yml).

### [Coveralls](https://coveralls.io/repos/github/environment-agency-austria/webgis4u/badge.svg?branch=master)
Keeps track of the code coverage in the project. The data shown is provided by the corresponding `Travis CI` step.

### [Greenkeeper](https://badges.greenkeeper.io/environment-agency-austria/webgis4u.svg)
Automatically tests dependency updates inside the valid version range based on package.json and creates GitHub issues if any errors occur.

## Commit messages and Versioning
We use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to highlight the intend of a certain commit. Be sure to follow the convention when contributing to the repo. To make this easy, we activated linting of commit messages. So be sure to check your commit message, if committing fails.

## Deploy a new version
Only the maintainers of the repo can deploy a new version.
Versions are automatically deployed when changes are pushed to the master branch. This triggers `travis` to run and deploy a new version to npm, a GitHub release and Git Tags. The actual semver to use is determined by looking at the commit messages.

## Useful commands
* `$> yarn build` - creates a production build
* `$> yarn start` - starts webpack in watch mode. Automatically recompiles when changes in the source are detected.
* `$> yarn test` - runs the unit tests.
* `$> yarn test:watch` - starts jest in watch mode. Runs the affected unit tests when changes in the source are detected.
* `$> yarn test:coverage` - runs the unit tests and reports the code coverage in the console window and in coverage/lcov-report/index.html
* `$> yarn lint` - manually runs the linter

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

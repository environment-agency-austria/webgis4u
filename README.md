# webgis4u
[![npm](https://img.shields.io/npm/v/webgis4u.svg)](https://www.npmjs.com/package/webgis4u)
[![GitHub license](https://img.shields.io/github/license/environment-agency-austria/webgis4u.svg)](https://github.com/environment-agency-austria/webgis4u/blob/master/LICENSE)
[![travis](https://travis-ci.com/environment-agency-austria/webgis4u.svg?branch=master)](https://travis-ci.com/environment-agency-austria/webgis4u)
[![Greenkeeper badge](https://badges.greenkeeper.io/environment-agency-austria/webgis4u.svg)](https://greenkeeper.io/)
[![Coverage Status](https://coveralls.io/repos/github/environment-agency-austria/webgis4u/badge.svg?branch=master)](https://coveralls.io/github/environment-agency-austria/webgis4u?branch=master)

This is the boilerplate code for the upcoming webgis4u project. Please update this readme when development starts.

## Getting started
1. Prepare your local devtools.
    * [Visual Studio Code](https://code.visualstudio.com/)
    * [node.js](https://nodejs.org/en/) (LTS version is recommended)
    * [yarn](https://yarnpkg.com/lang/en/) via `npm install -g yarn`
1. Create a GitHub account and get assigned to the environment-agency-austria organization by [@thomas-eaa](https://github.com/thomas-eaa)
2. Clone the repo locally by running `git clone https://github.com/environment-agency-austria/webgis4u.git`
3. Install the recommended Visual Studio Code plugins (eslint, gitflow, GitLens)
4. Install dependencies via `yarn` (without parameters)
5. Edit code, run tests, build, ...

## Recommended workflow
Link this package in the project where you'll be using it. You can then run `yarn start` inside this repo and
see your changes immediately:
* `webgis4u/ $ yarn link` to register this project locally. This is only needed the first time.
* `webgis4u/ $ yarn start` to start webpack in watch mode
* `project/ $ yarn link webgis4u` to use your local copy of webgis4u inside your project
* `project/ $ yarn start` (or whatever command you use to start the project locally)

Or create a showcase website with documentation and publish it to github pages :)

## Useful commands
* `yarn build` - creates a production build
* `yarn start` - starts webpack in watch mode. Automatically recompiles when changes in the source are detected.
* `yarn test` - runs the unit tests.
* `yarn test:watch` - starts jest in watch mode. Runs the affected unit tests when changes in the source are detected.
* `yarn test:coverage` - runs the unit tests and reports the code coverage in the console window and in coverage/lcov-report/index.html
* `yarn lint` - manually runs the linter
* `npm publish` - publish the package to npm.

## Preconfigured tools
### [Babel 7.1](https://babeljs.io)
Babel allows us to use cutting edge features without having to worry about older browsers. Configured in .babelrc with the following modules:
* babel preset: [babel-env](https://babeljs.io/docs/en/babel-preset-env)
* babel plugin [proposal object rest spread](https://babeljs.io/docs/en/babel-plugin-proposal-object-rest-spread)

### [Webpack 4](https://webpack.js.org/)
Webpack uses babel to transpile the source, then bundles and minimizes it for production. Configured in webpack.config.js.

### [Jest 23.6](https://jestjs.io/)
Used for unit testing and creating code coverage reports. Configured in jest.config.js.

### [ESlint](https://eslint.org/)
Enforces linting rules. Configured in .eslintrc.json.
* Currently configured to use the [eslint-eaa-contrib](https://github.com/environment-agency-austria/eslint-eaa-contrib) rules.

### [Travis CI](https://travis-ci.com/environment-agency-austria/webgis4u.svg?branch=master)
Automated build pipeline. Will build any commits in any branches automatically. Configured in .travis.yml. Current setup:
* build step: Installs all dependencies and tries to build the project.
* code coverage step: Runs the unit tests and reports the code coverage to coveralls.

### [Coveralls](https://coveralls.io/repos/github/environment-agency-austria/webgis4u/badge.svg?branch=master)
Keeps track of the code coverage in the project.

### [Greenkeeper](https://badges.greenkeeper.io/environment-agency-austria/webgis4u.svg)
Automatically tests dependency updates inside the valid version range based on package.json and creates GitHub issues if any errors occur.

### API Documentation
The API documentation can be found [here](https://environment-agency-austria.github.io/webgis4u/).


### Module and Naming Conventions
The naming convention is intended to work the same as the one established by OpenLayers. Have a look [here](https://openlayers.org/en/latest/doc/tutorials/background.html#module-and-naming-conventions).

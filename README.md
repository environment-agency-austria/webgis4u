# webgis4u
[![npm](https://img.shields.io/npm/v/webgis4u.svg)](https://www.npmjs.com/package/webgis4u)
[![GitHub license](https://img.shields.io/github/license/environment-agency-austria/webgis4u.svg)](https://github.com/environment-agency-austria/webgis4u/blob/master/LICENSE)
[![travis](https://travis-ci.com/environment-agency-austria/webgis4u.svg?branch=master)](https://travis-ci.com/environment-agency-austria/webgis4u)
[![Greenkeeper badge](https://badges.greenkeeper.io/environment-agency-austria/webgis4u.svg)](https://greenkeeper.io/)
[![Coverage Status](https://coveralls.io/repos/github/environment-agency-austria/webgis4u/badge.svg?branch=master)](https://coveralls.io/github/environment-agency-austria/webgis4u?branch=master)

`webgis4u` is a javascript client to visualise geographical maps based on [OpenLayers](https://openlayers.org/).



## Development
### API Documentation
The API documentation can be found [here](https://environment-agency-austria.github.io/webgis4u/).


### Module and Naming Conventions
The naming convention is intended to match the one established by OpenLayers. Have a look [here](https://openlayers.org/en/latest/doc/tutorials/background.html#module-and-naming-conventions).

### Recommended workflow
Link this package in the project where you'll be using it. You can then run `yarn start` inside this repo and
see your changes immediately:
* `webgis4u/ $ yarn link` to register this project locally. This is only needed the first time.
* `webgis4u/ $ yarn start` to start webpack in watch mode
* `project/ $ yarn link webgis4u` to use your local copy of webgis4u inside your project
* `project/ $ yarn start` (or whatever command you use to start the project locally)

## Contribute
If you are intereseted in contributing be sure to check out the information on [how to contribute](./.github/CONTRIBUTING.md) as it provides useful information on the current project setup.

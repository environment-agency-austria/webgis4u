# Changelog
All notable changes to this project will be documented in this file.

## Unreleased changes
* Added projections for the austrian area - [`austria`](./src/webgis4u/ol/proj/austria.js)
* Added [`basemap`](./src/webgis4u/ol/source/basemap.js) as a source - for more information, see [basemap.at](https://www.basemap.at/)
* Added following controls:
  * [`HtmlTemplate`](./src/webgis4u/ol/control/HtmlTemplate.js)
  * [`PanBar`](./src/webgis4u/ol/control/PanBar.js)
  * [`LayerCheckbox`](./src/webgis4u/ol/control/LayerCheckbox.js)
  * [`LayerRadioButton`](./src/webgis4u/ol/control/LayerRadioButton.js)
  * [`LegendDisplayable`](./src/webgis4u/ol/control/LegendDisplayable.js)
  * [`LegendVisibility`](./src/webgis4u/ol/control/LegendVisibility.js)
  * [`Measure`](./src/webgis4u/ol/control/Measure.js)
  * [`OverviewMap`](./src/webgis4u/ol/control/OverviewMap.js)
  * [`ScaleLine`](./src/webgis4u/ol/control/ScaleLine.js)
* Added utils:
  * [`dom`](./src/webgis4u/util/dom.js):
    * [`toggleElement`](./src/webgis4u/util/dom/toggleElement.js)
  * [`function`](./src/webgis4u/util/function.js):
    * [`debounce`](./src/webgis4u/util/function/debounce.js):
  * [`number`](./src/webgis4u/util/number.js):
    * [`convertUnitValue`](./src/webgis4u/util/number/convertUnitValue.js):
  * [`ol`](./src/webgis4u/util/ol.js):
    * [`getMapChildElementByClassName`](./src/webgis4u/util/ol/getMapChildElementByClassName.js):
    * [`getMapType`](./src/webgis4u/ol/util/getMapType.js)
    * [`getScale`](./src/webgis4u/ol/util/getScale.js)
    * [`pan`](./src/webgis4u/ol/util/pan.js)
  * [`string`](./src/webgis4u/util/string.js):
    * [`formatNumber`](./src/webgis4u/util/string/formatNumber.js):
    * [`formatUnitValue`](./src/webgis4u/util/string/formatUnitValue.js):
    * [`formatText`](./src/webgis4u/util/string/formatText.js):
* Added generation from templates using command line via `$> webgis4u -out <path> [-templates <path>]`

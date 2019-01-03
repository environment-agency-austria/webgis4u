import * as proj from 'ol/proj';
import {
  EPSG31287_ID,
  EPSG31254_ID,
  EPSG31255_ID,
  EPSG31256_ID,
  EPSG32632_ID,
  EPSG32633_ID,
} from './austria';

describe('webgis4u/ol/proj/epsg31287', () => {
  it('check EPSG:4326', () => {
    expect(proj.get('EPSG:4326')).not.toBeUndefined();
  });

  it('check EPSG:31287', () => {
    expect(proj.get(EPSG31287_ID)).not.toBeUndefined();
    expect(proj.get(EPSG31287_ID).getExtent()).not.toBeUndefined();
  });

  it('check EPSG:31254', () => {
    expect(proj.get(EPSG31254_ID)).not.toBeUndefined();
    expect(proj.get(EPSG31254_ID).getExtent()).not.toBeUndefined();
  });
  it('check EPSG:31255', () => {
    expect(proj.get(EPSG31255_ID)).not.toBeUndefined();
    expect(proj.get(EPSG31255_ID).getExtent()).not.toBeUndefined();
  });

  it('check EPSG:31256', () => {
    expect(proj.get(EPSG31256_ID)).not.toBeUndefined();
    expect(proj.get(EPSG31256_ID).getExtent()).not.toBeUndefined();
  });

  it('check EPSG:32632', () => {
    expect(proj.get(EPSG32632_ID)).not.toBeUndefined();
    expect(proj.get(EPSG32632_ID).getExtent()).not.toBeUndefined();
  });

  it('check EPSG:32633', () => {
    expect(proj.get(EPSG32633_ID)).not.toBeUndefined();
    expect(proj.get(EPSG32633_ID).getExtent()).not.toBeUndefined();
  });

  it('check EPSG:3857 (Google, Basemap Austria)', () => {
    expect(proj.get('EPSG:3857')).not.toBeUndefined();
  });

  it('check NotDefined EPSG CODE (EPSG:9999999999999)', () => {
    expect(proj.get('EPSG:9999999999999')).toBeNull();
  });
});

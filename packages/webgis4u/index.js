/**
 * main entry point for the webpack transpile processing
 */
// We import the styles to add them to the transpile process
import './src/scss/index.scss';

// Also, we just export whatever is actually exported by the module
export * from './src';

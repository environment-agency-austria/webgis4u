import * as examples from './examples';

// Get all the examples that were exported
const keys = Object.keys(examples);

export default keys.map(key => examples[key]);

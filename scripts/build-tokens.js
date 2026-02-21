// scripts/build-tokens.js
import StyleDictionary from 'style-dictionary';
import './style-dictionary.transforms.js'; // registers transforms/formats

import config from '../style-dictionary.config.js';

function build() {
  const sd = StyleDictionary.extend(config);
  sd.buildAllPlatforms();
  console.log('Style Dictionary build completed.');
}

build();

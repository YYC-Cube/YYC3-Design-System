// style-dictionary.config.js
export default {
  source: ['design/tokens.json', 'design/tokens.dark.json', 'design/tokens.animation.json', 'design/tokens.animation.dark.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        'size/remToRem',
        'color/oklch-to-hex',
        'shadow/compose'
      ],
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables'
        },
        {
          destination: 'variables.dark.css',
          format: 'css/variables',
          filter: (token) => {
            return token.filePath && token.filePath.includes('tokens.dark.json');
          }
        },
        {
          destination: 'animations.css',
          format: 'css/variables',
          filter: (token) => {
            return token.filePath && token.filePath.includes('tokens.animation.json');
          }
        }
      ]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      transforms: [
        'attribute/cti',
        'name/cti/camel',
        'color/oklch-to-hex',
        'shadow/compose'
      ],
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6'
        },
        {
          destination: 'tokens.dark.js',
          format: 'javascript/es6',
          filter: (token) => {
            return token.filePath && token.filePath.includes('tokens.dark.json');
          }
        },
        {
          destination: 'theme.js',
          format: 'javascript/theme'
        },
        {
          destination: 'theme.dark.js',
          format: 'javascript/theme',
          filter: (token) => {
            return token.filePath && token.filePath.includes('tokens.dark.json');
          }
        },
        {
          destination: 'animations.js',
          format: 'javascript/es6',
          filter: (token) => {
            return token.filePath && token.filePath.includes('tokens.animation.json');
          }
        },
        {
          destination: 'animations.dark.js',
          format: 'javascript/es6',
          filter: (token) => {
            return token.filePath && token.filePath.includes('tokens.animation.dark.json');
          }
        }
      ]
    }
  }
};

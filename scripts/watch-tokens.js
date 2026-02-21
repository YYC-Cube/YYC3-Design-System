// scripts/watch-tokens.js
const chokidar = require('chokidar');
const { exec } = require('child_process');

const watcher = chokidar.watch('design/tokens.json', { ignoreInitial: true });
watcher.on('change', (path) => {
  console.log(`${path} changed. Rebuilding tokens...`);
  exec('node ./scripts/build-tokens.js', (err, stdout, stderr) => {
    if (err) console.error(stderr);
    else console.log(stdout);
  });
});
console.log('Watching design/tokens.json for changes...');

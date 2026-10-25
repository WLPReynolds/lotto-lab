// Every place the version appears must agree, or the service worker and the About screen drift apart.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const read = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

test('version matches in package.json, src/app.js, sw.js and index.html', () => {
  const pkg = JSON.parse(read('package.json')).version;
  assert.match(pkg, /^\d+\.\d+\.\d+$/);
  assert.equal(/const APP_VERSION='([^']+)';/.exec(read('src/app.js'))?.[1], pkg, 'src/app.js APP_VERSION');
  assert.equal(/const CACHE = 'lottolab-v([^']+)';/.exec(read('sw.js'))?.[1], pkg, 'sw.js CACHE');
  assert.equal(/src="src\/app\.js\?v=([^"]+)"/.exec(read('index.html'))?.[1], pkg, 'index.html script tag');
});

test('service worker precaches the app script', () => {
  assert.match(read('sw.js'), /'src\/app\.js'/);
});

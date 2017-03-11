/**
 * CSS parsing
 */
const fs = require('fs');

const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const atImport = require('postcss-import');
const customProperties = require('postcss-custom-properties');
const customMedia = require('postcss-custom-media');
const mqpacker = require('css-mqpacker');

let srcPath = 'css/';
let destPath = 'bin/';
let filename = 'index.css';

let processors = [
  atImport,
  customProperties,
  customMedia,
  mqpacker({
    sort: true
  }),
  autoprefixer
];

let css = fs.readFileSync(srcPath + filename, 'utf8');

postcss(processors)
  .process(css, {
    from: srcPath + filename,
    to: destPath + filename
  })
  .then((result) => {
    fs.writeFileSync(destPath + filename, result.css);

    if (result.map) {
      fs.writeFileSync(destPath + filename + '.map', result.map);
    }
  });

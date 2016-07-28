'use strict';

const dirWalker = require('../plugitUtil/dirWalker');
const path = require('path');

module.exports = (dirs = []) => {
  dirWalker(dirs.map(dir => path.join(__dirname, '..', dir)), filePath => {
    delete require.cache[filePath];
    require(filePath);
  });
};
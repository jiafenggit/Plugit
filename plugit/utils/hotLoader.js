'use strict';

const dirWalker = require('./dirWalker');
const path = require('path');

module.exports = watchPaths => {
  return {
    preload: _ => dirWalker(watchPaths).map(filePath => require(filePath)),
    reload: _ => {
      return dirWalker(watchPaths).map(filePath => {
        delete require.cache[filePath];
        return require(filePath);
      });
    }
  };
};
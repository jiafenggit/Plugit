'use strict';

const dirWalker = require('./dirWalker');
const path = require('path');

module.exports = watchPaths => {
  return {
    preLoad: _ => dirWalker(watchPaths).map(filePath => require(filePath)),
    reLoad: _ => {
      return dirWalker(watchPaths).map(filePath => {
        delete require.cache[filePath];
        return require(filePath);
      });
    }
  };
};
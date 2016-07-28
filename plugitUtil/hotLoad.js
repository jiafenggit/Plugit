'use strict';

const dirWalker = require('../plugitUtil/dirWalker');
const path = require('path');
const appConfig = require('../app.conf.js');
const ComponentMapModel = require('../plugitModel/ComponentMapModel');
const ComponentRegistryModel = require('../plugitModel/ComponentRegistryModel');
const PluginMapModel = require('../plugitModel/PluginMapModel');
const PluginRegistryModel = require('../plugitModel/PluginRegistryModel');

const constantPreLoadPaths = ['plugitUtil', 'component', 'plugin'];
const preLoadPaths = [...constantPreLoadPaths, ...appConfig.hotLoad];

module.exports = {
  preload: function* () {
    yield ComponentMapModel.ensureIndexes();
    yield ComponentRegistryModel.ensureIndexes();
    yield PluginMapModel.ensureIndexes();
    yield PluginRegistryModel.ensureIndexes();
    dirWalker(preLoadPaths.map(dir => path.join(__dirname, '..', dir)), filePath => {
      require(filePath);
    });
  },
  reload: function* () {
    dirWalker(preLoadPaths.map(dir => path.join(__dirname, '..', dir)), filePath => {
      delete require.cache[filePath];
      require(filePath);
    });
  }
};
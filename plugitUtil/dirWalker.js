const fs = require('fs');
const assert = require('assert');
const path = require('path');

module.exports = (paths, handleFile) => {
  assert(Array.isArray(paths), 'paths should be an array');
  paths.forEach(function walk(p) {
    try {
      const stats = fs.statSync(p);
      if (stats.isDirectory()) {
        const files = fs.readdirSync(p);
        files.forEach(file => walk(path.join(p, file)));
      } else handleFile(p);
    } catch (e) {
      throw e;
    }
  });
};
const fs = require('fs');
const assert = require('assert');
const path = require('path');

module.exports = (paths, handleFile) => {
  assert(Array.isArray(paths), 'paths should be an array');
  function walk(p) {
    fs.stat(p, (err, stats) => {
      if (err) return;
      if (stats.isDirectory()) {
        fs.readdir(p, (err, files) => {
          if (err) return;
          files.forEach(file => {
            walk(path.join(p, file));
          });
        });
      } else {
        handleFile(p);
      }
    });
  }

  paths.forEach(walk);
};
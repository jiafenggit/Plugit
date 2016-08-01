const fs = require('fs');
const assert = require('assert');
const path = require('path');

module.exports = (paths) => {
  assert(Array.isArray(paths), 'paths should be an array');
  let files = [];
  paths.forEach(function walk(p) {
    try {
      const stats = fs.statSync(p);
      if (stats.isDirectory()) {
        const files = fs.readdirSync(p);
        files.forEach(file => { 
          if (/^\./.test(file)) return;
          walk(path.resolve(p, file));
        });
      } else files.push(p);
    } catch (e) {
      throw e;
    }
  });
  return files;
};
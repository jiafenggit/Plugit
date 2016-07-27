const fs = require('fs');

module.exports = function walk(path, handleFile) {
  fs.readdir(path, function (err, files) {
    if (err) {
      console.log(`Read dir error: ${err.message}`);
    } else {
      files.forEach(function (item) {
        var tmpPath = path + '/' + item;
        fs.stat(tmpPath, function (err1, stats) {
          if (err1) {
            console.log(`Stat error: ${err1.message}`);
          } else {
            if (stats.isDirectory()) {
              walk(tmpPath, handleFile);
            } else {
              handleFile(tmpPath);
            }
          }
        });
      });
    }
  });
};
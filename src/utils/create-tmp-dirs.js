const fs = require('fs');
const path = require('path');
const buildTmpPath = require('./build-tmp-path');

/**
 * @param {string[]} packagePaths Directories to create.
 * @param {import('debug').Debugger} debug Debugger instance.
 */
function createTmpDirs(packagePaths, debug) {
  debug('start');

  packagePaths.forEach((pkgPath) => {
    const tmpPath = buildTmpPath(pkgPath);
    const tmpPathFull = buildTmpPath(pkgPath, { addDestination: true });

    try {
      fs.mkdirSync(tmpPath);
    } catch (e) {
      if (e.code === 'EEXIST') {
        debug(`${path.relative(__dirname, tmpPath)} already exists`);
      } else {
        throw e;
      }
    }

    try {
      fs.mkdirSync(tmpPathFull);
    } catch (e) {
      if (e.code === 'EEXIST') {
        debug(`${path.relative(__dirname, tmpPathFull)} already exists`);
      } else {
        throw e;
      }
    }
  });

  debug('finish');
}

module.exports = createTmpDirs;

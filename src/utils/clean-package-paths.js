const fs = require('fs');
const path = require('path');
const buildTmpPath = require('./build-tmp-path');

/**
 * @param {string[]} packagePaths Directories to clean.
 * @param {import('debug').Debugger} debug Debugger instance.
 */
function cleanPackagePaths(packagePaths, debug) {
  debug('start');

  packagePaths.forEach((pkgPath) => {
    const tmpPathFull = buildTmpPath(pkgPath, { addDestination: true });

    try {
      fs.rmSync(tmpPathFull, { recursive: true });
    } catch (e) {
      if (e.code === 'ENOENT') {
        debug(`${path.relative(__dirname, tmpPathFull)} does not exist`);
      } else {
        throw e;
      }
    }
  });

  debug('finish');
}

module.exports = cleanPackagePaths;

const path = require('path');
const { TMP_PATH, TMP_PATH_DESTINATION } = require('./constants');

const buildTmpPath = (function memoize() {
  const cache = {};

  /**
   * @typedef BuildTmpPathOptions
   * @type {object}
   * @property {boolean} [addDestination=false]
   */

  /**
   * @param {string} pathToPackage The path to the root of the package we are constructing a tmp path for.
   * @param {BuildTmpPathOptions?} [options={}]
   */
  return function _buildTmpPath(pathToPackage, options = {}) {
    const cacheKey = JSON.stringify(arguments);

    if (!cache[cacheKey]) {
      cache[cacheKey] = path.join(
        pathToPackage,
        options.addDestination ? TMP_PATH_DESTINATION : TMP_PATH
      );
    }

    return cache[cacheKey];
  };
})();

module.exports = buildTmpPath;

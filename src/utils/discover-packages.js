const path = require("path");
const walkSync = require("walk-sync");

function getAllAddons(debug) {
  const rootPath = path.join(__dirname, "../../../../../");

  debug(`Finding packages in: ${rootPath}`);

  const packageJsonPaths = walkSync(rootPath, {
    directories: false,
    globs: ["**/package.json"],
    includeBasePath: true,
    ignore: [],
  });

  return packageJsonPaths.map(path.dirname);
}

/**
 * @param {import('debug').Debugger} debug A debugger instance.
 * @returns {string[]} An array of package paths.
 */
function discover(debug) {
  debug("start");

  const packagePaths = getAllAddons(debug);

  debug("end");

  return packagePaths;
}

module.exports = discover;

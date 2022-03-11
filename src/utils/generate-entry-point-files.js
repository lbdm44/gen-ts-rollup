const fs = require('fs');
const buildTmpPath = require('./build-tmp-path');
const generateEntryPoint = require('./generate-entry-point');

/**
 * @param {string[]} pkgPaths An array of paths we want to generate entry point files for.
 * @param {import('debug').Debugger} debug A debugger instance.
 */
function generateEntryPointFiles(pkgPaths, debug) {
  debug('start');

  const eps = pkgPaths.map((pkgPath) =>
    generateEntryPoint(pkgPath, debug.extend('generateEntryPoint'))
  );

  eps.forEach((entryPoint) => {
    const entryPointFilePath = `${buildTmpPath(entryPoint.path, {
      addDestination: true,
    })}/${entryPoint.name}.entry-point.ts`;

    const entryPointContents = entryPoint.files.map((fileNode) =>
      fileNode.getImportStatement(
        buildTmpPath(entryPoint.path, { addDestination: true })
      )
    );

    const entryPointExports = entryPoint.files.map(
      (fileNode) => fileNode.identifier
    );

    entryPointContents.push(`export { ${entryPointExports.join(', ')} };`);

    fs.writeFileSync(entryPointFilePath, entryPointContents.join(`\n`));
  });

  debug('end');
}

module.exports = generateEntryPointFiles;

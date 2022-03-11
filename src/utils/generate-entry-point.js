const { readFileSync } = require('fs');
const { parse } = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const walkSync = require('walk-sync');
const EntryPoint = require('./entry-point');
const FileNode = require('./file-node');

/**
 * @param {string} filePath A path to a file we want to ensure has exports.
 * @returns {boolean} True if the file path provided has exports.
 */
function hasExports(filePath) {
  const file = readFileSync(filePath, 'utf8');
  let foundExports = false;
  try {
    const ast = parse(file, {
      sourceType: 'module',
      plugins: [
        'decorators-legacy',
        'classProperties',
        'classPrivateProperties',
        'typescript',
      ],
    });

    traverse(ast, {
      ExportDefaultDeclaration: () => {
        foundExports = true;
      },
      ExportNamedDeclaration: () => {
        foundExports = true;
      },
    });
  } catch (e) {
    console.log(`Error: ${e.name} at ${filePath}`);
  }

  return foundExports;
}

/**
 * @param {string} pkgPath A path we want to generate an entry point file for.
 * @param {import('debug').Debugger} debug A debugger instance.
 */
function generateEntryPoint(pkgPath, debug) {
  debug('start');

  // Create an entry-point object to store the information we need to generate the file.
  const ep = new EntryPoint(pkgPath);

  // Find all the files within the provided path for potential
  const filePaths = walkSync(pkgPath, {
    directories: false,
    globs: ['**/*.js', '**/*.ts'],
    ignore: ['**/*.d.ts'],
    includeBasePath: true,
  });

  filePaths
    .filter(hasExports)
    .map((filePath) => new FileNode(filePath))
    .forEach((fn) => {
      ep.addFileNode(fn);
    });

  debug('end');

  return ep;
}

module.exports = generateEntryPoint;

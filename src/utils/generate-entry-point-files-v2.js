const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');

const buildTmpPath = require('./build-tmp-path');
const debug = require('./debug').extend('generateEntryPointFilesV2');
const generateEntryPoint = require('./generate-entry-point');

class FileExports {
  default = null;

  /**
   * @type {string[]}
   */
  named = [];

  filePath = null;

  constructor(filePath) {
    this.filePath = filePath;
  }
}

/**
 *
 * @param {string} filePath - A path to the file we want to get exports for.
 * @returns {FileExports}
 */
function getExportsFromFile(filePath) {
  const fileExports = new FileExports(filePath);

  const fileContents = fs.readFileSync(filePath, 'utf8');

  let ast;

  try {
    ast = parse(fileContents, {
      sourceType: 'module',
      plugins: [
        'decorators-legacy',
        'classProperties',
        'classPrivateProperties',
        'typescript',
      ],
    });
  } catch (e) {
    debug(`Error: ${e.name} parsing ${filePath}`);
  }

  if (ast) {
    traverse(ast, {
      ExportDefaultDeclaration: (declPath) => {
        const {
          node: { declaration },
        } = declPath;

        if (declaration.type === 'CallExpression') {
          // TODO: This pattern is rather brittle, essentially `export default foo()` probsbly should do `const f = foo(); export default f;`
          fileExports.default = declaration.callee.name;
        } else if (declaration.type === 'Identifier') {
          fileExports.default = declaration.name;
        } else if (
          declaration.type === 'ClassDeclaration' ||
          declaration.type === 'FunctionDeclaration'
        ) {
          fileExports.default = declaration.id.name;
        } else {
          debug(
            `Default Export Node Type Not Handled: ${declPath.node?.declaration?.type} in ${filePath}`
          );
        }
      },
      ExportNamedDeclaration: (declPath) => {
        const {
          node: { declaration, specifiers },
        } = declPath;

        /**
         * TODO: handle this scenario
         *
         * `export { default } from 'foo/bar';`
         *
         * Ends up being `import { default } from '../../foo/bar'`
         */

        if (specifiers.length) {
          specifiers.forEach((specifier) => {
            fileExports.named.push(specifier.exported.name);
          });
        } else if (
          declaration.type === 'ClassDeclaration' ||
          declaration.type === 'FunctionDeclaration' ||
          declaration.type === 'TSEnumDeclaration' ||
          declaration.type === 'TSInterfaceDeclaration' ||
          declaration.type === 'TSTypeAliasDeclaration'
        ) {
          fileExports.named.push(declaration.id.name);
        } else if (declaration.type === 'VariableDeclaration') {
          declaration.declarations.forEach((varDecl) => {
            fileExports.named.push(varDecl.id.name);
          });
        } else {
          debug(`Named export: ${declaration.type} not handled in ${filePath}`);
        }
      },
    });
  }

  return fileExports;
}

/**
 * @param {string[]} pkgPaths - A list of package paths to generate entry point files for.
 */
function generateEntryPointFilesV2(pkgPaths) {
  debug('start');

  const entryPoints = pkgPaths.map((pkgPath) =>
    generateEntryPoint(pkgPath, debug.extend('generateEntryPoint'))
  );

  entryPoints.forEach((entryPoint) => {
    const rollupPath = `${buildTmpPath(entryPoint.path, {
      addDestination: true,
    })}/rollup.${entryPoint.name}.ts`;

    // Gathering all exports for each file.
    entryPoint.files.forEach((fileNode) => {
      fileNode.exports = getExportsFromFile(fileNode.path);
    });

    const entryPointPath = buildTmpPath(entryPoint.path, {
      addDestination: true,
    });

    // TODO: handle where named exports are the same but from different files.

    // Creating import statements for each export.
    const importStatements = entryPoint.files.map((fileNode) => {
      const relativeImport = path
        .relative(entryPointPath, fileNode.path)
        .replace(path.extname(fileNode.path), '');

      // Handling named exports.
      const membersToImport = [...fileNode.exports.named];

      // Handle default export.
      if (fileNode.exports.default) {
        membersToImport.unshift(`default as ${fileNode.exports.default}`);
      }

      return `import { ${membersToImport.join(
        ', '
      )} } from '${relativeImport}';`;
    });

    const exportNames = entryPoint.files
      .map((fileNode) => {
        // Handling named exports.
        const membersToExport = [...fileNode.exports.named];

        // Handle default export.
        if (fileNode.exports.default) {
          membersToExport.unshift(fileNode.exports.default);
        }

        return membersToExport;
      })
      .flat();

    const rollupContents = [
      ...importStatements,
      `export { ${exportNames.join(', ')} };`,
    ];

    fs.writeFileSync(rollupPath, rollupContents.join(`\n`));
  });

  debug('end');
}

module.exports = {
  generateEntryPointFilesV2,
};

import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as fs from 'fs-extra';

import type { FileDetails } from './file-details';
import { debug } from '../utils/debug';

const getFileExportsDebug = debug.extend('get-file-exports');

export interface FileExports {
  defaultExport?: string;

  namedExports: string[];
}

export function getFileExports(fileDetails: FileDetails): FileExports {
  const { filePath } = fileDetails;
  const fileContents = fs.readFileSync(filePath, 'utf8');

  const fileExports: FileExports = {
    namedExports: [],
  };

  const ast = parse(fileContents, {
    sourceType: 'module',
    plugins: [
      'decorators-legacy',
      'classProperties',
      'classPrivateProperties',
      'typescript',
    ],
  });

  traverse(ast, {
    ExportDefaultDeclaration: (declPath) => {
      const {
        node: { declaration },
      } = declPath;

      // if (declaration.type === 'CallExpression') {
      //   // TODO: This pattern is rather brittle, essentially `export default foo()` probsbly should do `const f = foo(); export default f;`
      //   fileExports.defaultExport = declaration.callee?.name;
      // }

      if (declaration.type === 'Identifier') {
        fileExports.defaultExport = declaration.name;
      } else if (
        declaration.type === 'ClassDeclaration' ||
        declaration.type === 'FunctionDeclaration'
      ) {
        // Only supported named classes and functions at this time.
        fileExports.defaultExport = declaration.id?.name;
      } else {
        getFileExportsDebug(
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
          if (
            specifier.type === 'ExportDefaultSpecifier' ||
            specifier.type === 'ExportNamespaceSpecifier'
          ) {
            fileExports.namedExports.push(specifier.exported.name);
          } else if (specifier.exported.type === 'Identifier') {
            fileExports.namedExports.push(specifier.exported.name);
          } else {
            fileExports.namedExports.push(specifier.exported.value);
          }
        });
      } else if (
        declaration?.type === 'ClassDeclaration' ||
        declaration?.type === 'TSEnumDeclaration' ||
        declaration?.type === 'TSInterfaceDeclaration' ||
        declaration?.type === 'TSTypeAliasDeclaration'
      ) {
        fileExports.namedExports.push(declaration.id.name);
      } else if (
        declaration?.type === 'FunctionDeclaration' &&
        declaration.id
      ) {
        // Does not currently support anonymous functions
        fileExports.namedExports.push(declaration.id.name);
      } else if (declaration?.type === 'VariableDeclaration') {
        declaration.declarations.forEach((varDecl) => {
          if (varDecl.id.type === 'Identifier') {
            fileExports.namedExports.push(varDecl.id.name);
          }
        });
      } else {
        getFileExportsDebug(
          `Named export: ${declaration?.type} not handled in ${filePath}`
        );
      }
    },
  });

  return fileExports;
}

import * as path from 'path';
import walkSync from 'walk-sync';

import type { Options } from '../../types/gen-ts-rollup';
import { debug } from '../utils/debug';

const discoverDebug = debug.extend('discover-packages');

export function discoverPackages(options: Options): string[] {
  const { ignorePaths, root } = options;

  discoverDebug(`Discovering packages at: ${root}`);

  const packageJsonPaths = walkSync(root, {
    directories: false,
    globs: ['**/package.json'],
    ignore: [...ignorePaths],
    includeBasePath: true,
  });

  return packageJsonPaths.map(path.dirname);
}

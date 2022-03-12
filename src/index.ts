import type { GenerateOptions, Options } from '../types/gen-ts-rollup';
import { discoverPackages } from './discovery';
import { getAllPackageDetails } from './package-details';

import { debug } from './utils/debug';

export function generateRollup(partialOptions: GenerateOptions = {}) {
  const { ignorePaths = [], root = '.' } = partialOptions;
  const options: Options = {
    ignorePaths,
    root,
  };

  debug('start');

  const packagePaths = discoverPackages(options);

  const allPackageDetails = getAllPackageDetails(packagePaths);

  debug('end');
}

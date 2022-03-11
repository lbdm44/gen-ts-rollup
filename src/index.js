#!/usr/bin/env node

const ora = require('ora');
const {
  cleanPackagePaths,
  createTmpDirs,
  debug,
  discoverPackages,
  generateEntryPointFilesV2,
} = require('./utils');

function main() {
  debug('start');

  const progressSpinner = debug.enabled
    ? null
    : ora('Generating TS rollup files...\n').start();

  // Find package paths to prepare.
  const packagePaths = discoverPackages(debug.extend('discoverPackages'));

  // Clean package paths.
  cleanPackagePaths(packagePaths, debug.extend('cleanPackagePaths'));

  // Create tmp dirs.
  createTmpDirs(packagePaths, debug.extend('createTmpDirs'));

  // Generate Entry Point Files.
  // generateEntryPointFiles(packagePaths, debug.extend('generateEntryPoints'));
  generateEntryPointFilesV2(packagePaths);

  // TODO: Generate declaration files into the docs site dir

  // TODO: clean up tmp dirs inside of packages.

  progressSpinner?.succeed('TS Rollup files generated successfully!\n');

  debug('end');
}

main();

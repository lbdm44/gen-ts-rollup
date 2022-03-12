import walkSync from 'walk-sync';
import { FileDetails } from '../file-details';

import { PackageDetails } from './package-details';

export function getPackageDetails(pkgPath: string): PackageDetails {
  const pkgDetails = new PackageDetails(pkgPath);

  // Get files within package.
  const filePaths = walkSync(pkgPath, {
    directories: false,
    globs: ['**/*.js', '**/*.ts'],
    ignore: ['**/*.d.ts'],
    includeBasePath: true,
  });

  filePaths
    .map((filePath) => new FileDetails(filePath))
    .forEach((fileDetails) => {
      pkgDetails.addFileDetails(fileDetails);
    });

  return pkgDetails;
}

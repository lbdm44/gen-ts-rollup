import { getPackageDetails } from './get-package-details';
import { PackageDetails } from './package-details';

export function getAllPackageDetails(pkgPaths: string[]): PackageDetails[] {
  return pkgPaths.map((pkgPath) => {
    return getPackageDetails(pkgPath);
  });
}

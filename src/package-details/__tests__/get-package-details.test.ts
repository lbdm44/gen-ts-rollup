import * as path from 'path';
import { describe, expect, test } from 'vitest';
import { getPackageDetails } from '../get-package-details';

describe('get-package-details', () => {
  const FIXTURES_PATH = path.resolve(__dirname, './__fixtures__');
  const pkgA = path.resolve(FIXTURES_PATH, 'pkg-a');
  const pkgB = path.resolve(FIXTURES_PATH, 'pkg-b');

  test('it should find package details', () => {
    const packageDetails = getPackageDetails(pkgA);

    expect(packageDetails.path).toBe(pkgA);
    expect(packageDetails.files.length).toBe(2);
  });

  test('it should ignore type declaration files', () => {
    const packageDetails = getPackageDetails(pkgB);

    expect(packageDetails.path).toBe(pkgB);

    // `pkg-b` has a `types.d.ts` file that should be ignored.
    expect(packageDetails.files.length).toBe(2);
  });
});

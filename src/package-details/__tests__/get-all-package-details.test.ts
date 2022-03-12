import * as path from 'path';
import { describe, expect, test } from 'vitest';
import { getAllPackageDetails } from '../get-all-package-details';

describe('get-all-package-details', () => {
  const FIXTURES_PATH = path.resolve(__dirname, './__fixtures__');
  const pkgA = path.resolve(FIXTURES_PATH, 'pkg-a');
  const pkgB = path.resolve(FIXTURES_PATH, 'pkg-b');

  test('it should get all package details from the given paths', () => {
    const allPackageDetails = getAllPackageDetails([pkgA, pkgB]);

    expect(allPackageDetails.length).toBe(2);
  });
});

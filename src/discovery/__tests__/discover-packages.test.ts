import * as path from 'path';
import { describe, expect, test } from 'vitest';
import { discoverPackages } from '../discover-packages';

describe('discover-packages', () => {
  test('it should discover packages', () => {
    const root = path.resolve(__dirname, './__fixtures__/simple-app');
    const packagePaths = discoverPackages({
      ignorePaths: [],
      root,
    });

    expect(packagePaths).toEqual([root]);
  });

  test('it should discover packages in a complex app', () => {
    const root = path.resolve(
      __dirname,
      './__fixtures__/complex-app/packages/'
    );

    const packagePaths = discoverPackages({
      ignorePaths: [],
      root,
    });

    // The fixure has three packages, `pkg-c` does not have a `package.json` file and should not be discovered.
    expect(packagePaths).toEqual([`${root}/pkg-a`, `${root}/pkg-b`]);
  });

  test('it should honor ignored packages', () => {
    const root = path.resolve(
      __dirname,
      './__fixtures__/complex-app/packages/'
    );

    const packagePaths = discoverPackages({
      ignorePaths: ['*pkg-a'],
      root,
    });

    expect(packagePaths).toEqual([`${root}/pkg-b`]);
  });
});

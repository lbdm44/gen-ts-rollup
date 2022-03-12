import { describe, expect, test } from 'vitest';
import { discoverPackages } from '../discover-packages';

describe('discover-packages', () => {
  test('it should exist', () => {
    expect(discoverPackages).toBeDefined();
  });
});

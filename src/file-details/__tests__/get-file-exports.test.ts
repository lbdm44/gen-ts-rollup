import * as path from 'path';
import { describe, expect, test } from 'vitest';
import { FileDetails } from '../file-details';
import { getFileExports } from '../get-file-exports';

describe('get-file-exports', () => {
  const FIXTURES_PATH = path.resolve(__dirname, './__fixtures__');

  describe('js files', () => {
    test('it should get exports for a simple JS file', () => {
      const jsFilePath = path.resolve(FIXTURES_PATH, 'js-file.js');
      const fileDetails = new FileDetails(jsFilePath);
      const fileExports = getFileExports(fileDetails);

      expect(fileExports.defaultExport).toBeUndefined();
      expect(fileExports.namedExports).toEqual(['add']);
    });

    test('it should handle default class exports', () => {
      const jsFilePath = path.resolve(
        FIXTURES_PATH,
        'js-files/default-class-export.js'
      );
      const fileDetails = new FileDetails(jsFilePath);
      const fileExports = getFileExports(fileDetails);

      expect(fileExports.defaultExport).toBe('Foo');
      expect(fileExports.namedExports).toHaveLength(0);
    });

    test('it should handle default function exports', () => {
      const jsFilePath = path.resolve(
        FIXTURES_PATH,
        'js-files/default-fn-export.js'
      );
      const fileDetails = new FileDetails(jsFilePath);
      const fileExports = getFileExports(fileDetails);

      expect(fileExports.defaultExport).toBe('foo');
      expect(fileExports.namedExports).toHaveLength(0);
    });

    test('it should handle named class exports', () => {
      const jsFilePath = path.resolve(
        FIXTURES_PATH,
        'js-files/class-export.js'
      );
      const fileDetails = new FileDetails(jsFilePath);
      const fileExports = getFileExports(fileDetails);

      expect(fileExports.defaultExport).toBeUndefined();
      expect(fileExports.namedExports).toMatchSnapshot();
    });

    test('it should handle named function exports', () => {
      const jsFilePath = path.resolve(FIXTURES_PATH, 'js-files/fn-export.js');
      const fileDetails = new FileDetails(jsFilePath);
      const fileExports = getFileExports(fileDetails);

      expect(fileExports.defaultExport).toBeUndefined();
      expect(fileExports.namedExports).toMatchSnapshot();
    });

    test('it should handle complex exports', () => {
      const jsFilePath = path.resolve(
        FIXTURES_PATH,
        'js-files/complex-exports.js'
      );
      const fileDetails = new FileDetails(jsFilePath);
      const fileExports = getFileExports(fileDetails);

      expect(fileExports.defaultExport).toBe('foo');
      expect(fileExports.namedExports).toMatchSnapshot();
    });
  });

  describe('ts files', () => {
    const TS_FILES_PATH = path.resolve(FIXTURES_PATH, 'ts-files');

    test('it should get exports for a simple TS file', () => {
      const tsFile = path.resolve(FIXTURES_PATH, 'ts-file.ts');
      const fileDetails = new FileDetails(tsFile);

      const fileExports = getFileExports(fileDetails);

      expect(fileExports.defaultExport).toBeUndefined();
      expect(fileExports.namedExports).toEqual(['add']);
    });

    test('it should handle default class exports', () => {
      const tsFilePath = path.resolve(TS_FILES_PATH, 'default-class-export.ts');
      const fileDetails = new FileDetails(tsFilePath);
      const fileExports = getFileExports(fileDetails);

      expect(fileExports.defaultExport).toBe('Foo');
      expect(fileExports.namedExports).toHaveLength(0);
    });

    test('it should handle default function exports', () => {
      const tsFilePath = path.resolve(TS_FILES_PATH, 'default-fn-export.ts');
      const fileDetails = new FileDetails(tsFilePath);
      const fileExports = getFileExports(fileDetails);

      expect(fileExports.defaultExport).toBe('foo');
      expect(fileExports.namedExports).toHaveLength(0);
    });

    test('it should handle complex exports', () => {
      const tsFilePath = path.resolve(
        FIXTURES_PATH,
        'ts-files/complex-exports.ts'
      );
      const fileDetails = new FileDetails(tsFilePath);
      const fileExports = getFileExports(fileDetails);

      expect(fileExports.defaultExport).toBe('foo');
      expect(fileExports.namedExports).toMatchSnapshot();
    });
  });
});

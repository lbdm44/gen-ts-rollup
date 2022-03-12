export class FileDetails {
  defaultExport: string | undefined;

  namedExports: string[] = [];

  constructor(public filePath: string) {}
}

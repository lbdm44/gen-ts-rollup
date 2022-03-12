import { FileDetails } from '../file-details';

export class PackageDetails {
  files: FileDetails[] = [];

  constructor(public path: string) {}

  addFileDetails(file: FileDetails) {
    this.files.push(file);
  }
}

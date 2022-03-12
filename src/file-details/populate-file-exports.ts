import { FileDetails } from './file-details';
import { getFileExports } from './get-file-exports';

export function populateFileExports(fileDetails: FileDetails): FileDetails {
  const fileExports = getFileExports(fileDetails);

  fileDetails.defaultExport = fileExports.defaultExport;
  fileDetails.namedExports = [...fileExports.namedExports];

  return fileDetails;
}

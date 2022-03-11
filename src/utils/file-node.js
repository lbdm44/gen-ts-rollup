const Path = require('path');

const STRING_CLASSIFY_REGEXP_1 = /^(-|_)+(.)?/;
const STRING_CLASSIFY_REGEXP_2 = /(.)(-|_|\.|\s)+(.)?/g;
const STRING_CLASSIFY_REGEXP_3 = /(^|\/|\.)([a-z])/g;

function classify(str) {
  // Totally taken from EmberJS's `@ember/string` package
  const replace1 = (_match, _separator, chr) =>
    chr ? `_${chr.toUpperCase()}` : '';
  const replace2 = (_match, initialChar, _separator, chr) =>
    initialChar + (chr ? chr.toUpperCase() : '');
  const parts = str.split('/');
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i]
      .replace(STRING_CLASSIFY_REGEXP_1, replace1)
      .replace(STRING_CLASSIFY_REGEXP_2, replace2);
  }
  return parts
    .join('/')
    .replace(STRING_CLASSIFY_REGEXP_3, (match) => match.toUpperCase());
}

/**
 * @param {string} filePath The path we want to generate an ID for.
 * @returns {string}
 */
function generateId(filePath) {
  const extensionName = Path.extname(filePath);
  const baseName = Path.basename(filePath, extensionName);

  return classify(baseName);
}

class FileNode {
  exports;

  /**
   * A flag to indicate if we should re-export this file in our entrypoint.
   */
  hasExports = false;

  _identifier = null;

  get identifier() {
    if (!this._identifier) {
      this._identifier = generateId(this.path);
    }

    return this._identifier;
  }

  constructor(path) {
    this.path = path;
  }

  /**
   * @param {string} entryPointFilePath The path to the entrypoint.
   * @returns {string} A correct import statement for this file.
   */
  getImportStatement(entryPointFilePath) {
    const relativeImport = Path.relative(entryPointFilePath, this.path).replace(
      Path.extname(this.path),
      ''
    );

    return `import * as ${this.identifier} from '${relativeImport}';`;
  }
}

module.exports = FileNode;

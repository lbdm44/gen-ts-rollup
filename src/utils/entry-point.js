class EntryPoint {
  /**
   * @type {FileNode[]}
   */
  files = [];

  /**
   * @type {string}
   */
  entryPointPath;

  /**
   * @type {string}
   */
  name;

  /**
   * @param {string} path The path to this entry point.
   */
  constructor(path) {
    this.path = path.replace(/\/$/, ''); // Remove trailing slashes
    this.entryPointPath = `${this.path}/tmp`;
    this.name = this.path.split('/').pop();
  }

  addFileNode(fileNode) {
    this.files.push(fileNode);
  }
}

module.exports = EntryPoint;

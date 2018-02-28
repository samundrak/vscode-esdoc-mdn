const vscode = require("vscode");
class TextDocumentContentProvider {
  constructor() {
    this._onDidChange = new vscode.EventEmitter();
  }
  update(uri) {
    this._onDidChange.fire(uri);
  }
  provideTextDocumentContent(uri) {
    return `Hello at ${Date.now()}`;
  }
}

module.exports = TextDocumentContentProvider;

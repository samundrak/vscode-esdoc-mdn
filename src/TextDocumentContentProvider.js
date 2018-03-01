const vscode = require("vscode");
const DocumentationProvider = require('./DocumentationProvider');

class TextDocumentContentProvider {
  constructor() {
    this._onDidChange = new vscode.EventEmitter();
    this.content = '';
    this.docsUrl = null;
    this.documentationProvider = new DocumentationProvider();
  }
  update(uri, docsUrl) {
    this.docsUrl = docsUrl;
    this._onDidChange.fire(uri);
  }
  provideTextDocumentContent(uri, docsUrl) {
    try {
      if (!this.docsUrl) return Promise.resolve(this.content);
      return this.documentationProvider.setUrl(this.docsUrl).getDoc();
    } catch (err) {
      vscode.window.showErrorMessage(err.message);
    }
  }
  get onDidChange() {
    return this._onDidChange.event;
  }

}

module.exports = TextDocumentContentProvider;

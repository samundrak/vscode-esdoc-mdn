const vscode = require("vscode");
const DocumentationProvider = require('./DocumentationProvider');

class TextDocumentContentProvider {
  constructor() {
    this._onDidChange = new vscode.EventEmitter();
    this.content = '';
    this.docsUrl = undefined;
    this.documentationProvider = new DocumentationProvider();
    this.isLoading = false;
  }

  update({ uri, docsUrl = null, query = null, isLoading = true }) {
    if (this.docsUrl === docsUrl) return;
    this.isLoading = isLoading;
    this.query = query;
    this._onDidChange.fire(uri);
    this.docsUrl = docsUrl;
    setTimeout(() => {
      this._onDidChange.fire(uri);
    }, 1000);
  }
  provideTextDocumentContent(uri, docsUrl) {
    try {
      if (this.isLoading) {
        this.isLoading = false;
        return this.documentationProvider.loading(this.query);
      }
      if (!this.docsUrl) return `No documentation found about "${this.query}"`;
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

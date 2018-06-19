const vscode = require('vscode');
const DocumentationProvider = require('./DocumentationProvider');
const EventEmitter = require('events').EventEmitter;

class View extends EventEmitter {
  constructor({ context }) {
    super();
    this.context = context;
    this.documentationProvider = new DocumentationProvider();
    this.onPanelDisponse = this.onPanelDisponse.bind(this);
  }
  create(options = {}) {
    this.panel = vscode.window.createWebviewPanel(
      View.CODE, // Identifies the type of the webview. Used internally
      View.NAME, // Title of the panel displayed to the user
      vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
      Object.assign({}, options),
    );
    // Reset when the current panel is closed
    this.panel.onDidDispose(
      this.onPanelDisponse,
      null,
      this.context.subscriptions,
    );
  }
  show({ docsUrl, query }) {
    if (!this.panel) {
      this.create();
    }
    if (this.panel && !this.panel.visible) {
      this.panel.reveal(vscode.ViewColumn.Two);
    }
    if (!docsUrl) {
      return this.setContent(`No documentation found about "${query}"`);
    }
    this.setContent(this.documentationProvider.loading(query));
    return this.documentationProvider
      .getDoc(docsUrl)
      .then(html => {
        this.setContent(html);
      })
      .catch(error => {
        this.setContent(
          `Problem finding docs for ${query}, Error: ${error.message}`,
        );
      });
  }

  setContent(html) {
    this.panel.webview.html = html;
  }

  onPanelDisponse() {
    this.panel = null;
    this.emit('dispose');
  }

  dispose() {
    if (this.panel) {
      this.panel.dispose();
    }
  }
}
View.CODE = 'esdocMdn';
View.NAME = 'ESDoc MDN';
module.exports = View;

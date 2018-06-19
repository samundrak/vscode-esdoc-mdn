const vscode = require('vscode');
const { window } = vscode;
const { getUrlFromToken } = require('./helper');

class ESDoc {
  constructor(view, urlToDocs) {
    this.view = view;
    this.urlToDocs = urlToDocs;
    this.lastQuery = null;
    this.view.on('dispose', this.handleViewDispose.bind(this));
  }
  parseLine(line) {
    if (!line.match(ESDoc.TOKEN)) {
      return;
    }
    return (line.replace(ESDoc.TOKEN, '') || '').trim();
  }

  update() {
    // Get the current text editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }
    let doc = editor.document;
    if (doc.languageId !== 'javascript') {
      return;
    }
    if (!editor.selection.isEmpty) {
      return;
    }
    const position = editor.selection.active;
    const textLine = doc.lineAt(position.line);
    const query = this.parseLine(textLine.text);
    if (!query) return;
    if (!query.endsWith(ESDoc.END_TOKEN)) {
      this.view.dispose();
      window.showTextDocument(doc);
      return;
    }
    if (query === this.lastQuery) return;
    this.lastQuery = query;
    const finalQuery = query.replace(ESDoc.END_TOKEN, '');
    const url = getUrlFromToken(finalQuery, this.urlToDocs);
    this.view.show({
      docsUrl: url,
      isLoading: !!url,
      query: finalQuery,
    });
    window.showTextDocument(doc);
  }

  handleViewDispose() {
    this.lastQuery = null;
  }
}
ESDoc.END_TOKEN = ';';
ESDoc.TOKEN = /\/\/\s?mdn/;
ESDoc.IS_DRAWER_OPEN = false;
ESDoc.PREVIEW_URI = vscode.Uri.parse('esdoc://samundrak/esdoc');
module.exports = ESDoc;

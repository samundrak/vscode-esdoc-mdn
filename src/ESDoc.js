const vscode = require("vscode");
const { window, TextLine, workspace, Uri } = vscode;
const { getUrlFromToken } = require('./helper');

class ESDoc {
  constructor(provider, urlToDocs) {
    this.provider = provider;
    this.urlToDocs = urlToDocs;
  }
  parseLine(line) {
    if (!line.match(ESDoc.TOKEN)) {
      return;
    }
    return (line.replace(ESDoc.TOKEN, "") || "").trim();
  }

  update() {
    // Get the current text editor
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    let doc = editor.document;

    if (doc.languageId !== "javascript") {
      return;
    }
    if (!editor.selection.isEmpty) {
      return;
    }
    const position = editor.selection.active;
    const textLine = doc.lineAt(position.line);
    const query = this.parseLine(textLine.text);
    if (!query) return;
    if (!query.endsWith(ESDoc.END_TOKEN)) return;
    if (!ESDoc.IS_DRAWER_OPEN) {
      ESDoc.IS_DRAWER_OPEN = true;
      this.drawer = this.openDrawer();
    }
    const finalQuery = query.replace(ESDoc.END_TOKEN, '');
    const url = getUrlFromToken(finalQuery, this.urlToDocs);
    if (!url) {
      this.provider.update({ uri: ESDoc.PREVIEW_URI, docsUrl: false, isLoading: false, query: finalQuery });
      return;
    }
    this.provider.update({ uri: ESDoc.PREVIEW_URI, docsUrl: url, isLoading: true, query: finalQuery });
  }

  openDrawer() {
    return vscode.commands
      .executeCommand(
      "vscode.previewHtml",
      ESDoc.PREVIEW_URI,
      vscode.ViewColumn.Two,
      "ESDoc",
    )
      .then(
      success => {
      },
      reason => {
        vscode.window.showErrorMessage(reason);
      }
      );
  }
}
ESDoc.END_TOKEN = ';';
ESDoc.TOKEN = /\/\/\s?mdn/;
ESDoc.IS_DRAWER_OPEN = false;
ESDoc.PREVIEW_URI = vscode.Uri.parse("esdoc://samundrak/esdoc");
module.exports = ESDoc;

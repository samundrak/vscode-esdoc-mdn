const vscode = require("vscode");
const { window, TextLine, workspace, Uri } = vscode;

class ESDoc {
  constructor(provider) {
    this.provider = provider;
  }
  parseLine(line) {
    if (!line.match(ESDoc.TOKEN)) {
      return;
    }
    return (line.replace(ESDoc.TOKEN, "") || "").trim();
  }
  updateWordCount() {
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
    const token = this.parseLine(textLine.text);
    if (!token) return;
    if (!token.endsWith("..")) return;
    if (!ESDoc.IS_DRAWER_OPEN) {
      ESDoc.IS_DRAWER_OPEN = true;
      this.openDrawer();
    }
    this.provider.update(ESDoc.PREVIEW_URI);
  }

  openDrawer() {
    return vscode.commands
      .executeCommand(
        "vscode.previewHtml",
        ESDoc.PREVIEW_URI,
        vscode.ViewColumn.Two,
        "ESDoc",
        { pinned: false }
      )
      .then(
        success => {},
        reason => {
          vscode.window.showErrorMessage(reason);
        }
      );
  }
}

ESDoc.TOKEN = /\/\/\s?mdn/;
ESDoc.IS_DRAWER_OPEN = false;
ESDoc.PREVIEW_URI = vscode.Uri.parse("esdoc://samundrak/esdoc");
module.exports = ESDoc;

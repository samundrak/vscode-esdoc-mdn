const vscode = require("vscode");
const { window, Disposable } = vscode;

class ESDocController {
  constructor(esdoc) {
    this._esdoc = esdoc;

    // subscribe to selection change and editor activation events
    let subscriptions = [];
    window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
    window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

    let highlight = vscode.window.createTextEditorDecorationType({
      backgroundColor: "rgba(200,200,200,.35)"
    });

    vscode.commands.registerCommand(
      "extension.showHtmlEscape",
      (uri, propStart, propEnd) => {
        for (let editor of vscode.window.visibleTextEditors) {
          if (editor.document.uri.toString() === uri.toString()) {
            let start = editor.document.positionAt(propStart);
            let end = editor.document.positionAt(propEnd + 1);

            editor.setDecorations(highlight, [new vscode.Range(start, end)]);
            setTimeout(() => editor.setDecorations(highlight, []), 1500);
          }
        }
      }
    );
    // update the counter for the current file
    this._esdoc.updateWordCount();

    // create a combined disposable from both event subscriptions
    this._disposable = Disposable.from(...subscriptions);
  }

  dispose() {
    this._disposable.dispose();
  }

  _onEvent() {
    this._esdoc.updateWordCount();
  }
}

module.exports = ESDocController;

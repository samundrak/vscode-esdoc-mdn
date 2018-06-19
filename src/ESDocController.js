const vscode = require('vscode');
const { window, Disposable } = vscode;

class ESDocController {
  constructor(esdoc) {
    this._esdoc = esdoc;

    // subscribe to selection change and editor activation events
    let subscriptions = [];
    window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
    window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

    this._esdoc.update();

    // create a combined disposable from both event subscriptions
    this._disposable = Disposable.from(...subscriptions);
  }

  dispose() {
    this._disposable.dispose();
  }

  _onEvent() {
    this._esdoc.update();
  }
}

module.exports = ESDocController;

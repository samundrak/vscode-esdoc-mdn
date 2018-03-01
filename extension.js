// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const ESDoc = require("./src/ESDoc");
const ESDocController = require("./src/ESDocController");
const TextDocumentContentProvider = require("./src/TextDocumentContentProvider");
const urlToDocs = require('./src/links.json');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // create a new word counter
  let provider = new TextDocumentContentProvider();
  let registration = vscode.workspace.registerTextDocumentContentProvider(
    "esdoc",
    provider
  );
  let esdoc = new ESDoc(provider, urlToDocs);
  let controller = new ESDocController(esdoc);

  // Add to a list of disposables which are disposed when this extension is deactivated.
  context.subscriptions.push(controller);
  context.subscriptions.push(esdoc);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;

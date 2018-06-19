// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const ESDoc = require('./src/ESDoc');
const ESDocController = require('./src/ESDocController');
const View = require('./src/View');
const urlToDocs = require('./src/links.json');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  // create a new word counter
  try {
    const webView = new View({ context });
    let esdoc = new ESDoc(webView, urlToDocs);
    let controller = new ESDocController(esdoc);

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(esdoc);
  } catch (error) {
    console.error(error);
  }
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;

const vscode = require('vscode');

//mdn object;
module.exports = {
  getUrlFromToken(token, urlToDocs) {
    const [globalObject, method] = token.split('.');
    const lang = vscode.workspace.getConfiguration().get('esdoc.language');
    const urlToGlobalObjectDoc = urlToDocs[(globalObject || '').toLowerCase()].replace('en-US', lang);
    if (!urlToGlobalObjectDoc) return;
    const url = method
      ? `${urlToGlobalObjectDoc}/${method}`
      : urlToGlobalObjectDoc;
    return `https://developer.mozilla.org/${url}`;
  },
  getExtension(filename) {
    return (filename || '').split('.').pop();
  },
};

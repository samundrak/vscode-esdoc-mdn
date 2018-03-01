module.exports = {
    getUrlFromToken(token, urlToDocs) {
        const [globalObject, method] = token.split('.');
        const urlToGlobalObjectDoc = urlToDocs[(globalObject || '').toLowerCase()];
        if (!urlToGlobalObjectDoc) return;
        const url = method ? `${urlToGlobalObjectDoc}/${method}` : urlToGlobalObjectDoc;
        return `https://developer.mozilla.org/${url}`;
    }
}
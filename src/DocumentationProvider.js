const axios = require('axios');
const jsdom = require('jsdom');

const content = 'https://developer.mozilla.org//en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from'
class DocumentationProvider {

    setUrl(url) {
        this.url = url;
        return this;
    }

    async fetchResource() {
        const data = await axios.get(this.url);
        return data;
    }

    async parseDocumentation(rawHtml) {
        return new jsdom.JSDOM(rawHtml);
    }

    async getDoc() {
        const rawHtml = await this.fetchResource();
        const jsdom = await this.parseDocumentation(rawHtml.data);
        return this.fullHtml({
            head: this.createStyleSheet(jsdom.window.document),
            body: jsdom.window.document.getElementById('wiki-content').innerHTML
        });
    }

    createStyleSheet(document) {
        const styleSheets = Array.from((document.querySelectorAll('link[rel="stylesheet"]') || []));
        return styleSheets.map(style => `
        <link href="${style.href}" rel="stylesheet" type="text/css" />
        `).join(',').replace(/,/g, '');
    }
    fullHtml({ head = '', body = 'No Content' }) {
        return `
        <html>
            <head>
             ${head}
            </head>
            <body>
                <div style="background-color:white;color:black;padding:10px;max-width: 100%;
                overflow-x: hidden;">
                    ${body}                
                </div>
            </body>
        </html>
        `;
    }
}

module.exports = DocumentationProvider;
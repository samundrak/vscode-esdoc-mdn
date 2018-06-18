const axios = require('axios');
const jsdom = require('jsdom');

class DocumentationProvider {
  fetchResource(url) {
    return axios.get(url);
  }

  parseDocumentation(rawHtml) {
    return new jsdom.JSDOM(rawHtml);
  }

  async getDoc(url) {
    const rawHtml = await this.fetchResource(url);
    const jsdom = await this.parseDocumentation(rawHtml.data);
    return this.fullHtml({
      head: this.createStyleSheet(jsdom.window.document),
      body: jsdom.window.document.getElementById('wiki-content').innerHTML,
    });
  }

  createStyleSheet(document) {
    const styleSheets = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]') || [],
    );
    return styleSheets
      .map(
        style => `
        <link href="${style.href}" rel="stylesheet" type="text/css" />
        `,
      )
      .join(',')
      .replace(/,/g, '');
  }
  fullHtml({ head = '', body = 'No Content' }) {
    return `
        <html>
            <head>
             ${head}
            </head>
            <body onload="onClose">
                <div style="background-color:white;color:black;padding:10px;max-width: 100%;
                overflow-x: hidden;">
                    ${body}                
                </div>
            </body>
        </html>
        `;
  }

  loading(doc) {
    return `
        <html>
        <head>
        <style>
        .center {
            position: absolute;
            width: 300px;
            height: 200px;
            z-index: 15;
            top: 50%;
            left: 50%;
            margin: -100px 0 0 -150px;
          }
          </style>
        </head>
            <body>
            <div class="lds-css ng-scope center">
            <div style="width:100%;height:100%" class="lds-eclipse"><div></div></div><style type="text/css">@keyframes lds-eclipse {
                0% {
                  -webkit-transform: rotate(0deg);
                  transform: rotate(0deg);
                }
                50% {
                  -webkit-transform: rotate(180deg);
                  transform: rotate(180deg);
                }
                100% {
                  -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
                }
              }
              @-webkit-keyframes lds-eclipse {
                0% {
                  -webkit-transform: rotate(0deg);
                  transform: rotate(0deg);
                }
                50% {
                  -webkit-transform: rotate(180deg);
                  transform: rotate(180deg);
                }
                100% {
                  -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
                }
              }
              .lds-eclipse {
                position: relative;
              }
              .lds-eclipse div {
                position: absolute;
                -webkit-animation: lds-eclipse 1s linear infinite;
                animation: lds-eclipse 1s linear infinite;
                width: 160px;
                height: 160px;
                top: 20px;
                left: 20px;
                border-radius: 50%;
                box-shadow: 0 4px 0 0 #ffffff;
                -webkit-transform-origin: 80px 82px;
                transform-origin: 80px 82px;
              }
              .lds-eclipse {
                width: 200px !important;
                height: 200px !important;
                -webkit-transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
                transform: translate(-100px, -100px) scale(1) translate(100px, 100px);
              }
              </style>
              Loading Docs for ${doc}
              </div>
            </body>
        </html>
       `;
  }
}

module.exports = DocumentationProvider;

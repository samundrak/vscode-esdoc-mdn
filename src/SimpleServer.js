var http = require('http');
var socket = require('socket.io');
const getPort = require('get-port');

module.exports = (ESDoc) => new Promise((resolve, reject) => {
    const app = http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Welcome');
    });
    const io = socket(app);
    getPort().then((port) => {
        app.listen(port);
        io.on('connection', function (socket) {
            socket.on('disconnect', function () {
                ESDoc.IS_DRAWER_OPEN = false;
            });
        });
        resolve(port);
    })
        .catch(reject);
});
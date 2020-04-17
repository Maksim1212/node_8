const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');
const chalk = require('chalk');
const headers = require('./proxy');

const proxy = httpProxy.createProxyServer({});

http.createServer((req, res) => {
    let urlParts = {};

    try {
        urlParts = url.parse(req.url, true);
    } catch (error) {
        console.log(error);
    }

    if (urlParts.query.host) {
        global.host = urlParts.query.host;
    }
    proxy.web(req, res, {
        target: global.host,
        changeOrigin: true,
        selfHandleResponse: true,
        followRedirects: true,
        toProxy: false,
    });
}).listen(3000);

headers.init(proxy);
console.log(chalk.yellow('listening on port 3000'));

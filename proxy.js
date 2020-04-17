const zlib = require('zlib');
const stream = require('stream');

module.exports = {
    init(proxy) {
        proxy.on('proxyRes', (proxyRes, req, res) => {
            let body = [];

            proxyRes.on('data', (chunk) => {
                body.push(chunk);
            });

            proxyRes.on('end', () => {
                body = Buffer.concat(body);

                zlib.gunzip(body, (err, buffer) => {
                    let pageData = buffer.toString();
                    pageData += `<h1 style="
                    position: absolute;
                    top: 10%;
                    left: 45%;
                    color: blue;
                "> Hello world </h1>`;

                    const dataLength = Buffer.byteLength(pageData, 'utf8');
                    const outStream = stream.Readable.from(pageData);

                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Content-Encoding': 'gzip',
                        'Content-Length': dataLength,
                    });
                    outStream.pipe(zlib.createGzip()).pipe(res);
                });
            });
        });
    },
};

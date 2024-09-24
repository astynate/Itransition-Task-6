const { createProxyMiddleware } = require('http-proxy-middleware');

const context = ["/api"];

const onError = (err, req, resp, target) => {
    console.error(`${err.message}`);
}

module.exports = function (app) {
  const appProxy = createProxyMiddleware(context, {
    proxyTimeout: 10000,
    target: "http://localhost:5000",
    onError: onError,
    ws: true,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    },
  });

  app.use(appProxy);
};
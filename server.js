import config from './webpack.config';

const
    _v = config.vars,
    compiler = _v.webpack(config);

_v.cssModulesRequireHook({generateScopedName: '[path][name]-[local]'});

// Serve hot-reloading bundle to client
_v.app.use(_v.webpackDevMiddleware(compiler, {
  noInfo: true, publicPath: config.output.publicPath
}));
_v.app.use(_v.webpackHotMiddleware(compiler));

// Do "hot-reloading" of react stuff on the server
// Throw away the cached client modules and let them be re-required next time
compiler.plugin('done', function() {
  console.log("Clearing /src/ module cache from server");
  Object.keys(require.cache).forEach(function(id) {
    if (/[\/\\]src[\/\\]/.test(id)) delete require.cache[id];
  });
});

const server = _v.http.createServer(_v.app);
server.listen(config.EXPRESS_PORT, 'localhost', function(err) {
  if (err) throw err;

  const addr = server.address();

  console.log('Listening at http://%s:%d', addr.address, addr.port);
});

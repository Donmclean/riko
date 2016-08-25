import config from './webpack.config';

const _v = config.vars;

config.entry.unshift('webpack/hot/only-dev-server');
config.entry.unshift('webpack-dev-server/client?http://localhost:'+config.EXPRESS_PORT);

new _v.WebpackDevServer(_v.webpack(config), {
    contentBase: config.output.path,
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    hot: true
}).listen(config.EXPRESS_PORT, 'localhost', function (err, result) {
    if (err) { console.log(err) }
    console.log('Listening at localhost:'+config.EXPRESS_PORT);
});
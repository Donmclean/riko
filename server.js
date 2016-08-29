import config from './webpack.config';

const _v = config.vars;

switch (_v.NODE_ENV) {
    case "development": {

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

        break;
    }
    default: {

        _v.app.use(_v.morgan('dev'));

        const root = config.destDir;
        _v.app.use(_v.express.static(root));
        _v.app.use(_v.fallback('index.html', { root }));

        _v.app.listen(config.EXPRESS_PORT);

        _v.app.use((err, req, res, next) => {
            console.error("ERROR --> : ", err.stack);
            next(err);
        });

        break;
    }
}

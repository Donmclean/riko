const
    _v      = require('../config/variables')(),
    funcs   = require('../config/functions')();

module.exports = (runCommand) => {
    const { $, electronPackager, browserSync } = _v;

    //handle environment variables
    process.env.NODE_ENV = (runCommand === 'web-dev') ? 'development' : 'production';
    process.env.ELECTRON = (runCommand === 'electron-dev' || runCommand === 'electron-prod');
    process.env.LIVE = (runCommand === 'web-prod-server');
    if(JSON.parse(process.env.ELECTRON)) {
        process.env.NODE_ENV = (runCommand === 'electron-dev') ? 'development' : 'production';
    }

    console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

    const customConfig = funcs.getFileIfExists(`${_v.cwd}/src/rikoconfig`);
    const config = require('../webpack.config');

    switch (runCommand) {
        case 'electron-server': {
            _v.qfs.list(customConfig.destDir).then((files) => {
                switch (_v.os.platform()) {
                    case 'darwin': {
                        //handles open electron app on MAC
                        const macFile = _v._.find(files, (file) => file.match(/\b(darwin)\b/i));

                        if(macFile) {
                            //TODO: fix error here
                            _v.spawn('open', [`-a`, `${customConfig.moduleName}`, `${_v.cwd}/${_v.path.basename(customConfig.destDir)}/${macFile}/${customConfig.moduleName}.app`], {stdio: 'inherit'});
                        } else {
                            funcs.logElectronRunServerError();
                        }

                        break;
                    }
                    default: {
                        break;
                    }
                }
            })
                .catch((err) => {
                    funcs.logElectronRunServerError();
                    console.error('ERROR >', err);
                });
            break;
        }
        case 'web-prod': {
            return _v.spawn(`${_v.baseDir}/node_modules/.bin/webpack`, [`--config`, `${_v.baseDir}/webpack.config.js`], {stdio: 'inherit'});
        }
        case 'electron-dev':
        case 'web-dev': {
            const stats = funcs.getStats('development');

            //*******************************************************************
            //HOT RELOADING WITH WEBPACK DEV SERVER
            //*******************************************************************

            config.entry[customConfig.moduleName].unshift('webpack/hot/dev-server');
            config.entry[customConfig.moduleName].unshift(`webpack-dev-server/client?http://localhost:${customConfig.EXPRESS_PORT}`);
            config.entry[customConfig.moduleName].unshift('react-hot-loader/patch');

            const { overlay } = customConfig.hotReloadingOptions;

            new _v.WebpackDevServer(_v.webpack(config), {
                contentBase: config.output.path,
                publicPath: config.output.publicPath,
                historyApiFallback: true,
                hot: true,
                overlay,
                inline: true,
                headers: { 'Access-Control-Allow-Origin': '*' },
                stats
            }).listen(customConfig.EXPRESS_PORT, 'localhost', (err) => {
                if (err) { console.log(err); }
                console.log(`Listening at localhost: ${customConfig.EXPRESS_PORT}`);
                funcs.onDevBuildActions(customConfig);
            });

            break;
        }
        default: {

            console.log('JSON.parse(process.env.ELECTRON): ', JSON.parse(process.env.ELECTRON));

            if(JSON.parse(process.env.ELECTRON)) {
                return _v.webpack(config, () => {
                    //Compile The Electron Application
                    customConfig.electronPackagingOptions.overwrite = true;
                    electronPackager(customConfig.electronPackagingOptions, (err) => {
                        if(err) {
                            console.error('ERROR > in electron build', err);
                            throw err;
                        }

                        funcs.removeDir(customConfig.tempDir).then(() => {
                            console.log(customConfig.electronPackagingOptions.name + " build successfully!");
                        });
                    });
                });
            }

            _v.app.use(_v.morgan('dev'));

            const root = customConfig.destDir;
            _v.app.use(_v.express.static(root));
            _v.app.use(_v.fallback('index.html', { root }));

            _v.app.listen(customConfig.EXPRESS_PORT);

            _v.app.use((err, req, res, next) => {
                console.error("ERROR --> : ", err.stack);
                next(err);
            });

            let isLiveServer;

            try {
                isLiveServer = JSON.parse(process.env.LIVE);
            } catch (err) {
                isLiveServer = false;
            }

            if(!isLiveServer) {
                console.log('Launching Browser Sync proxy of port: ' + customConfig.EXPRESS_PORT);

                browserSync.init({
                    proxy: 'localhost:' + customConfig.EXPRESS_PORT
                });
            } else {
                console.log('Listening on port: ' + customConfig.EXPRESS_PORT);
            }

            break;
        }
    }
};
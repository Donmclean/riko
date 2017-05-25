const
    _v                          = require('./utils/variables')(),
    funcs                       = require('./utils/functions')(),
    customConfig                = require('./utils/coreRikoConfig'),
    webpackConfigUtils          = require('./utils/webpackConfigUtils')(_v, funcs, customConfig);

//CONFIGURATION
const config = new _v.immutable.Map().withMutations((configMap) => {

    configMap.set('context', customConfig.baseDir);

    configMap.set('entry', customConfig.entry);

    configMap.set('output', _v.immutable.fromJS({
        filename: '[name].[hash].js',
        path: customConfig.output.path,
        publicPath: '/'
    }));

    //Set Additional node_modules Resolver Paths
    const yarnNodeModulePath = _v.path.resolve(_v.os.homedir() + '/.config/yarn/global/', 'node_modules');
    const yarnNodeModulePathLinuxRoot = _v.path.resolve('/usr/local/share/.config/yarn/global', 'node_modules');
    const yarnNodeModulePathWindows = _v.path.resolve('%LOCALAPPDATA%/Yarn/config/global', 'node_modules');

    const moduleResolverPaths = [
        _v.path.resolve(customConfig.baseDir, "node_modules"),
        _v.path.resolve(_v.baseDir, "node_modules"),
        yarnNodeModulePath,
        yarnNodeModulePathLinuxRoot,
        yarnNodeModulePathWindows
    ];

    configMap.set('resolve', _v.immutable.fromJS({
        extensions: ['.js', '.jsx', '.json'],
        modules: moduleResolverPaths
    }));

    configMap.set('resolveLoader', _v.immutable.fromJS({
        modules: moduleResolverPaths
    }));

    configMap.set('module', _v.immutable.fromJS({
        rules: []
    }));

    configMap.set('plugins', _v.immutable.fromJS([]));

    configMap.set('stats', funcs.getStats(process.env.NODE_ENV));

    // Set Global Config Options
    const globalCustomOptionsMap = new _v.immutable.Map().withMutations((globalCustomOptionsMap) => {
        globalCustomOptionsMap.setIn(['module', 'rules'], _v.immutable.fromJS([]));
        globalCustomOptionsMap.set('plugins', _v.immutable.fromJS([]));
        customConfig.setWebpackConfigOptions('global', globalCustomOptionsMap, _v.webpack, _v.immutable);
    });

    const globalDefaults = webpackConfigUtils.getDefaultConfigOptions('global', configMap);
    funcs.handleCustomAdditions(configMap, globalCustomOptionsMap, globalDefaults.rules, globalDefaults.plugins);

    switch (process.env.NODE_ENV) {
        case "production": {
            configMap.setIn(['output', 'sourceMapFilename'], '[file].[hash].map');
            configMap.set('devtool', customConfig.devtool || false);
            configMap.set('bail', true);

            // Set Production Config Options
            const productionCustomOptionsMap = new _v.immutable.Map().withMutations((productionCustomOptionsMap) => {
                productionCustomOptionsMap.setIn(['module', 'rules'], _v.immutable.fromJS([]));
                productionCustomOptionsMap.set('plugins', _v.immutable.fromJS([]));
                customConfig.setWebpackConfigOptions('production', productionCustomOptionsMap, _v.webpack, _v.immutable);
            });

            const productionDefaults = webpackConfigUtils.getDefaultConfigOptions('production', configMap);
            funcs.handleCustomAdditions(configMap, productionCustomOptionsMap, productionDefaults.rules, productionDefaults.plugins);

            break;
        }
        case "test":
        case "development": {
            configMap.set('devtool', customConfig.devtool || false);
            configMap.set('bail', false);

            configMap.set('devServer', _v.immutable.fromJS({
                hot: true,
                // enable HMR on the server

                contentBase: configMap.getIn(['output', 'path']),
                // match the output path

                publicPath: configMap.getIn(['output', 'publicPath'])
                // match the output `publicPath`
            }));

            // Set Development Config Options
            const developmentCustomOptionsMap = new _v.immutable.Map().withMutations((developmentCustomOptionsMap) => {
                developmentCustomOptionsMap.setIn(['module', 'rules'], _v.immutable.fromJS([]));
                developmentCustomOptionsMap.set('plugins', _v.immutable.fromJS([]));
                customConfig.setWebpackConfigOptions('development', developmentCustomOptionsMap, _v.webpack, _v.immutable);
            });

            const developmentDefaults = webpackConfigUtils.getDefaultConfigOptions('development', configMap);
            funcs.handleCustomAdditions(configMap, developmentCustomOptionsMap, developmentDefaults.rules, developmentDefaults.plugins);
            break;
        }
        default: {
            break;
        }
    }
});

module.exports = config.toJS();

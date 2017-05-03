const config = {
    entry: {
        index: [ './src/js/index.js' ]
    },
    output: {
        path: 'dist'
    }
};

config.setWebpackConfigOptions = (env, webpackConfig) => {
    switch (env) {
        case 'global': {
            return webpackConfig;
        }
        case 'production': {
            return webpackConfig;
        }
        case 'development': {
            return webpackConfig;
        }
        default: {
            return webpackConfig;
        }
    }
};

config.setWebpackLoaders = (env, loaders) => {
    switch (env) {
        case 'global': {
            return loaders;
        }
        case 'production': {
            return loaders;
        }
        case 'development': {
            return loaders;
        }
        default: {
            return [];
        }
    }
};

config.setWebpackPlugins = (env, plugins) => {
    const { webpack, HtmlWebpackPlugin, ProgressBarPlugin, ExtractTextPlugin } = plugins;
    switch (env) {
        case 'global': {
            return [
                new HtmlWebpackPlugin({
                    title: 'Riko',

                    template: 'src/templates/index.pug',
                    favicon: 'src/media/images/riko-favicon.png',
                    inject: 'body',
                    hash: true,
                    cache: true, //default
                    showErrors: true, //default

                    scripts: [],
                    stylesheets: []
                }),
                new webpack.EnvironmentPlugin([
                    "NODE_ENV"
                ]),
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                    }
                }),
                new ProgressBarPlugin({
                    format: 'webpack [:bar] ' + ':percent' + ' (:elapsed seconds)',
                    clear: true
                })
            ];
        }
        case 'production': {
            return [
                new webpack.optimize.UglifyJsPlugin({
                    mangle: false,
                    sourceMap: true
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'index',
                    filename: 'assets/js/[name].js?[hash]'
                }),
                new webpack.ProvidePlugin({}),
                new ExtractTextPlugin({
                    filename: 'assets/css/styles.min.css?[hash]',
                    allChunks: true
                }),
            ];
        }
        case 'development': {
            return [];
        }
        default: {
            return [];
        }
    }
};

config.electronPackagerOptions = {
    icon: 'src/riko-logo.icns',
    platform: 'all',
    asar: true
};

config.EXPRESS_PORT = 3000;

config.hotReloadingOptions = {
    overlay: true,

    BrowserSyncReloadOnChange: false,

    hotExecuteTestCommand: 'test',

    hotExecuteFlowTypeCommand: 'default'
};

config.sourcemapType = 'source-map';

config.sourcemapDev = true;
config.sourcemapProd = true;

config.autoprefixerOptions = { browsers: ['> 0%'] }; //prefix everything: browsers: ['> 0%']

config.customBoilerplatePath = 'src/riko-custom-boilerplates';

module.exports = config;
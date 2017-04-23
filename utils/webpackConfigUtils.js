module.exports = (_v, funcs, customConfig) => {
    const webpackConfigUtils = {};

    webpackConfigUtils.getEslintRule = () => ({
        test: /\.jsx$|\.js$/,
            include: customConfig.srcDir,
            exclude: /(node_modules|vendor|bower_components)/,
            enforce: 'pre',
            use: [{
                loader: 'eslint-loader',
                options: customConfig.eslintLoaderOptions
            }]
    });

    webpackConfigUtils.getHtmlWebpackPluginOptions = () => Object.assign(
        {},
        { title: customConfig.title },
        customConfig.plugins.htmlWebpackPlugin.options,
        {
            scripts: customConfig.externalScripts,
            stylesheets: customConfig.externalStylesheets
        }
    );

    webpackConfigUtils.getUglifyJsPluginOptions = () => Object.assign(
        {},
        { mangle: false, sourceMap: customConfig.sourcemapProd },
        customConfig.uglifyJsPluginOptions
    );

    webpackConfigUtils.getDefinePluginOptions = () => Object.assign(
        {},
        {
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        },
        customConfig.definePluginOptions
    );

    webpackConfigUtils.getElectronPackagerOptions = () => Object.assign(
        {},

        //Default
        {
            platform: ['darwin'],
            icon: _v.path.resolve(__dirname, '../build-assets/riko-logo.incs')
        },

        //Custom
        customConfig.electronPackagerOptions,

        //Required
        {
            dir: customConfig.tempDir,
            name: customConfig.title,
            prune: false,
            overwrite: true,
            out: customConfig.destDir
        }
    );

    return webpackConfigUtils;
};
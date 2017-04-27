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
            prune: false,
            overwrite: true,
            out: customConfig.output.path
        }
    );

    return webpackConfigUtils;
};
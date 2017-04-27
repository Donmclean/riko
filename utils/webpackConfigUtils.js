module.exports = (_v, funcs, customConfig) => {
    const webpackConfigUtils = {};

    webpackConfigUtils.getElectronPackagerOptions = () => Object.assign(
        {},

        //Default
        {
            platform: 'all',
            icon: _v.path.resolve(__dirname, '../build-assets/riko-logo.incs')
        },

        //Custom
        customConfig.electronPackagerOptions,

        //Required
        {
            dir: customConfig.tempDir,
            overwrite: true,
            out: customConfig.output.path
        }
    );

    return webpackConfigUtils;
};
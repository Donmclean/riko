const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const getDefaultStats = (NODE_ENV) => ({
    colors: true, hash: true, version: true, timings: true, assets: NODE_ENV === 'production',
    chunks: false, modules: false, reasons: false, children: false, source: false,
    errors: true, errorDetails: true, warnings: true, publicPath: false
});

const stylesheetProdRules = (config, type, regex) => ({
    test: new RegExp(regex),
    use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        allChunks: true,
        use: [
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    plugins: () => {
                        return [
                            autoprefixer({ browsers: ['> 0%'] })
                        ];
                    }
                }
            },
            (type !== 'css') ? {
                loader: `${type}-loader`,
                options: {
                    sourceMap: true
                }
            } : false
        ].filter(Boolean)
    })
});

const stylesheetDevRules = (config, type, regex) => ({
    test: new RegExp(regex),
    loaders: [
        'style-loader',
        `css-loader${config.devtool ? '?sourceMap' : ''}`,
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: !!config.devtool,
                plugins: () => {
                    return [
                        autoprefixer({ browsers: ['> 0%'] })
                    ];
                }
            }
        },
        (type !== 'css') ? `${type}-loader${!!config.devtool ? '?sourceMap' : ''}` : false
    ].filter(Boolean)
});

module.exports = { stylesheetDevRules, stylesheetProdRules, getDefaultStats };
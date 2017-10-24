import customConfig from './utils/coreRikoConfig';
import { getDefaultConfigOptions } from './utils/webpackConfigUtils';
import { baseDir } from './utils/variables';
import { getStats, handleCustomAdditions, setCustomConfigOptions, setEntryHelper } from './utils/functions';
import { Map, fromJS } from 'immutable';
import path from 'path';

//CONFIGURATION
const config = new Map().withMutations((configMap) => {

    process.traceDeprecation = true;

    configMap.set('context', customConfig.baseDir);

    configMap.set('entry', setEntryHelper(customConfig));

    configMap.set('output', fromJS({
        filename: '[name].[hash].js',
        path: customConfig.output.path,
        publicPath: '/'
    }));

    const moduleResolverPaths = [
        path.resolve(customConfig.baseDir, "node_modules"),
        path.resolve(baseDir, "node_modules")
    ];

    configMap.set('resolve', fromJS({
        extensions: ['.js', '.jsx', '.json'],
        modules: moduleResolverPaths
    }));

    configMap.set('resolveLoader', fromJS({
        modules: moduleResolverPaths
    }));

    configMap.set('module', fromJS({
        rules: []
    }));

    configMap.set('plugins', fromJS([]));

    configMap.set('stats', getStats(process.env.NODE_ENV));

    // Set Global Config Options
    const globalCustomOptionsMap = setCustomConfigOptions(customConfig, 'global');

    const globalDefaults = getDefaultConfigOptions('global', configMap);

    handleCustomAdditions(configMap, globalCustomOptionsMap, globalDefaults.rules, globalDefaults.plugins);

    switch (process.env.NODE_ENV) {
        case "production": {
            configMap.set('devtool', customConfig.devtool || false);
            configMap.set('bail', true);

            // Set Production Config Options
            const productionCustomOptionsMap = setCustomConfigOptions(customConfig, 'production');

            const productionDefaults = getDefaultConfigOptions('production', configMap);

            handleCustomAdditions(configMap, productionCustomOptionsMap, productionDefaults.rules, productionDefaults.plugins);

            break;
        }
        case "test":
        case "development": {
            configMap.set('devtool', customConfig.devtool || false);
            configMap.set('bail', false);

            configMap.set('devServer', fromJS({
                hot: true,
                // enable HMR on the server

                contentBase: configMap.getIn(['output', 'path']),
                // match the output path

                publicPath: configMap.getIn(['output', 'publicPath'])
                // match the output `publicPath`
            }));

            // Set Development Config Options
            const developmentCustomOptionsMap = setCustomConfigOptions(customConfig, 'development');

            const developmentDefaults = getDefaultConfigOptions('development', configMap);

            handleCustomAdditions(configMap, developmentCustomOptionsMap, developmentDefaults.rules, developmentDefaults.plugins);

            break;
        }
        default: {
            break;
        }
    }
});

export default config.toJS();

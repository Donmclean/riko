import customConfig from './utils/coreRikoConfig';
import { getDefaultConfigOptions } from './utils/webpackConfigUtils';
import { baseDir } from './utils/variables';
import { getStats, handleCustomAdditions, setCustomConfigOptions } from './utils/functions';
import immutable from 'immutable';
import path from 'path';
import os from 'os';

//CONFIGURATION
const config = new immutable.Map().withMutations((configMap) => {

    process.traceDeprecation = true;

    configMap.set('context', customConfig.baseDir);

    configMap.set('entry', customConfig.entry);

    configMap.set('output', immutable.fromJS({
        filename: '[name].[hash].js',
        path: customConfig.output.path,
        publicPath: '/'
    }));

    //Set Additional node_modules Resolver Paths
    const yarnNodeModulePath = path.resolve(os.homedir() + '/.config/yarn/global/', 'node_modules');
    const yarnNodeModulePathLinuxRoot = path.resolve('/usr/local/share/.config/yarn/global', 'node_modules');
    const yarnNodeModulePathWindows = path.resolve('%LOCALAPPDATA%/Yarn/config/global', 'node_modules');

    const moduleResolverPaths = [
        path.resolve(customConfig.baseDir, "node_modules"),
        path.resolve(baseDir, "node_modules"),
        yarnNodeModulePath,
        yarnNodeModulePathLinuxRoot,
        yarnNodeModulePathWindows
    ];

    configMap.set('resolve', immutable.fromJS({
        extensions: ['.js', '.jsx', '.json'],
        modules: moduleResolverPaths
    }));

    configMap.set('resolveLoader', immutable.fromJS({
        modules: moduleResolverPaths
    }));

    configMap.set('module', immutable.fromJS({
        rules: []
    }));

    configMap.set('plugins', immutable.fromJS([]));

    configMap.set('stats', getStats(process.env.NODE_ENV));

    // Set Global Config Options
    const globalCustomOptionsMap = setCustomConfigOptions(customConfig, 'global');

    const globalDefaults = getDefaultConfigOptions('global', configMap);

    handleCustomAdditions(configMap, globalCustomOptionsMap, globalDefaults.rules, globalDefaults.plugins);

    switch (process.env.NODE_ENV) {
        case "production": {
            configMap.setIn(['output', 'sourceMapFilename'], '[name].[hash].map');
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

            configMap.set('devServer', immutable.fromJS({
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

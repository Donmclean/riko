[![RIKO](build-assets/riko-logo.png)](https://github.com/Donmclean/riko)

Modern CLI Build System for creating Javascript Projects (Node, React, React Native & Electron)

[![npm](https://img.shields.io/badge/npm-v1.0.21-blue.svg)](https://www.npmjs.com/package/riko-cli) [![Build Status](https://travis-ci.org/Donmclean/riko.svg?branch=master)](https://travis-ci.org/Donmclean/riko) [![dependencies Status](https://david-dm.org/donmclean/riko/status.svg)](https://david-dm.org/donmclean/riko) [![devDependencies Status](https://david-dm.org/donmclean/riko/dev-status.svg)](https://david-dm.org/donmclean/riko?type=dev) [![Test Coverage](https://codeclimate.com/github/Donmclean/riko/badges/coverage.svg)](https://codeclimate.com/github/Donmclean/riko/coverage) [![Code Climate](https://codeclimate.com/github/Donmclean/riko/badges/gpa.svg)](https://codeclimate.com/github/Donmclean/riko) [![Known Vulnerabilities](https://snyk.io/test/github/Donmclean/riko/badge.svg)](https://snyk.io/test/github/Donmclean/riko) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Donmclean/riko/blob/master/LICENSE) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NVQAJLLBQKUUG) [![DUB](https://img.shields.io/badge/Author-Don%20Mclean-red.svg)](http://donsmclean.com)

Riko is as much a concept of building as it is build system. It is designed to aid developers throughout the project lifecycle as well as increasing their efficiency.
Learn more about the Riko concept [**here**](docs/concept.md)

# INSTALL

- `npm install -g riko-cli`

# COMMANDS

###### **Setup** a new (highly customizable) project with defaults
- `riko s|setup`
    - `<project-type> [react, react-native, electron, node-server]`
    - `<project-name> 'Awesome New Web Project'`
    - `[-h | --help] 'displays helpful info about current command'`
    - example 1: `riko setup react Awesome New React Project`
    - example 2: `riko s electron Amazing New Electron Project`
    - example 3: `riko s -h`
    
###### **Run** a build related task from your project base directory
- `riko r|run`
    - `<run-command> [react-dev, react-prod, react-server, react-prod-server, electron-dev, electron-prod, electron-server, node-server-dev, node-server-prod]`
    - `[-h | --help] 'displays helpful info about current command'`
    - example 1: `riko run react-dev`
    - example 2: `riko r electron-prod`
    - example 3: `riko run --help`
    
###### **Create** default and custom boilerplate files to increase developer workflow
- `riko c|create`
    - `<file-type> [component, componentDir, dummy-component, test-component]`
    - `<file-name..> Footer`
    - `[-h | --help] 'displays helpful info about current command'`
    - example 1: `riko create component Footer`
    - example 2: `riko c componentDir Header`
    - example 3: `riko create -h`
    
###### **Help** displays helpful instructions on command usage
- `riko -h|--help`
    - example 1: `riko --help`
    - example 2: `riko -h`
    
###### **Version** displays cli version
- `riko -v|--version`
    - example 1: `riko --version`
    - example 2: `riko -v`

# FEATURES

Supports the development of [**Node JS**](https://nodejs.org), [**React**](https://facebook.github.io/react/), [**React Native**](https://facebook.github.io/react-native/) & [**Electron**](http://electron.atom.io/) Projects.

#### React | Electron Projects
- Supports compilation of [**es6 js**](http://es6-features.org/) & [**jsx**](https://facebook.github.io/react/docs/jsx-in-depth.html) source files via [**babel**](https://babeljs.io/).
- Supports compilation of [**pug**](https://pugjs.org) template files to html.
- Supports preprocessing of [**sass**](http://sass-lang.com/), [**less**](http://lesscss.org/) and [**stylus**](http://stylus-lang.com/) stylesheets.
- Supports generation of [**Source mapping**](https://www.npmjs.com/package/source-map) for stylesheets and js sources.
- Supports [**Flow**](https://flowtype.org/) Static Type Checking out of the box.
- Supports [**Yarn**](https://yarnpkg.com/). The new fast, reliable and secure dependency management tool.
- Javascript (_js_,_jsx_) linting via [**eslint**](http://eslint.org/).
- Stylesheet (_sass_, _less_, _css_) linting via [**stylelint**](https://github.com/stylelint/stylelint).
- [**Autoprefixing**](https://github.com/postcss/autoprefixer) for stylesheets.
- [**Browsersync**](https://www.browsersync.io/) functionality by default.
- [**Jest**](https://facebook.github.io/jest/), [**Mocha**](https://mochajs.org/), [**Chai**](http://chaijs.com/) unit testing.
- [**Selenium Testing**](http://www.seleniumhq.org/) via [**Nightwatch JS**](http://nightwatchjs.org/) & [**Browserstack**](https://www.browserstack.com/)

###### - Development Mode: eg: `riko run react-dev` | `riko r electron-dev`

- [**Hot Module Replacement**](https://webpack.github.io/docs/hot-module-replacement.html) for stylesheets (_sass,css,less_) and js (_js,jsx_) sources.
- [**Error proofing**](https://github.com/webpack/webpack-dev-server/issues/522) (on error a helpful overlay pops up displaying the error).
- [**Remote Debugging**](http://vorlonjs.com/): Debug your application on almost any device.
- [**Electron Mode**](http://electron.atom.io/) has the exact same features as **React** setup with [**electron**](http://electron.atom.io/) native OS powers.

###### - Production Mode: `riko run react-prod` | `riko r electron-prod`

- [**Tree Shaking**](https://webpack.js.org/guides/tree-shaking/): Since Riko uses [**Webpack 2**](https://webpack.js.org) to bundle [**React**](https://facebook.github.io/react/) & [**Electron**](http://electron.atom.io/) projects, it automatically removes unused code to achieve the smallest bundle sizes.
- [**Electron Packager**](https://github.com/electron-userland/electron-packager): Bundles your electron app with your specified options via `rikoconfig.js`.

# CAVEATS

- FOUC (Flash of Unstyled Content)

    - To make the hot reloading of CSS work, we are not extracting CSS in development. Ideally, during server rendering, we will be extracting CSS, and we will get a .css file, and we can use it in the html template. That's what we are doing in production. 
    - In development, after all scripts get loaded, react loads the CSS as BLOBs. That's why there is a second of FOUC in development.

- Full support for MAC OS only. Only Partial Support for Windows/Linux/Ubuntu Development.

    - This Build System is not yet tested for development on Windows, Linux, or Ubuntu and 
    therefore there are currently unsupported.

# USAGE

- After running a setup command like: `riko setup react myNewProject`. `cd` into your project then run `npm install` or `yarn` (_highly recommended_) if you have [yarn](https://yarnpkg.com/) installed
- After entered your new project directory and installing it's dependencies you can now execute `run` commands like: `riko run react-dev` or `riko run electron-prod`. it all depends on what project you chose when you ran `setup`. 
    **NOTE: _WHEN SETTING UP A MOBILE (REACT NATIVE) APP ON MAC_**<br/>
        - You must have [xcode](https://developer.apple.com/xcode), a valid [iOS simulator](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/iOS_Simulator_Guide/Introduction/Introduction.html), [Android Studio](https://developer.android.com/studio/index.html), [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and [JRE](https://java.com/en/download/) installed.<br/>
        - You must have [brew](http://brew.sh/) installed.<br/>
    **NOTE: _WHEN SETTING UP AN ELECTRON APP ON MAC_**<br/>
        - You must have [xcode](https://developer.apple.com/xcode) installed.<br/>
        - You must successfully run `sh src/electron.sh` to be able to package a __windows__ version of your app.<br/>
        - If this fails you should complete the following instructions:<br/>
        [Install Wine on Mac](https://www.davidbaumgold.com/tutorials/wine-mac/) to package a __windows__ version of your app.

- After running one of the setup commands notice there is a new `src/` folder in the directory. 
- here is where all of your source code will live. From js scripts to stylesheets, etc.

# RIKO CONFIG

- This is where all your build related settings will live. The build system has been created so you rarely have to manage labor intensive build configurations.
- All you would need to do is customize your `rikoconfig.js` file.

##### REACT & ELECTRON CONFIG OPTIONS

Port your wish to serve your files on.
```javascript
SERVER_PORT: 3000;
```

##### WEBPACK REQUIRED SETTINGS
```javascript
entry: {
    index: [ './src/js/index.js' ]
}

output: {
    path: path.resolve(cwd, 'dist')
}

devtool: 'source-map' //set to false to disable default source mapping
```

##### WEBPACK OPTIONAL CUSTOM SETTINGS
We can further customize the webpack config with the below function. see docs [**here**](https://webpack.js.org/configuration/).
_setWebpackConfigOptions(env, config, webpack, immutable)_
- Arguments
    - _env_ (String): environment in which to set config options in.
    - _config_ (Instance of Immutable JS Map [withMutations](https://facebook.github.io/immutable-js/docs/#/Map/withMutations)): contains current state of the webpack config in a mutable Map which allows you to easily set and customize the webpack config. see example below.
    - _webpack_ (Webpack instance): useful for including this like `webpack.optimize.UglifyJsPlugin` or logging current configuration, etc.
    - _immutable_ (Immutable JS instance): useful for applying additional logic when handling the `config` argument. 
- Returns <_undefined_>
```javascript
setWebpackConfigOptions: (env, config, webpack, immutable) => {
    const SomeRandomWebpackPlugin = require('some-random-webpack-plugin');
    
    //set optional webpack configurations based on environment
    switch (env) {
        case 'global': {
            //This plugin will be available in both development & production builds
            config.set('plugins', [
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                    }
                })
            ]);
            
            //you are able to edit any vaild webpack config option
            configMap.set('devtool', 'source-map');
            break;
        }
        case 'production': {
            //These plugins will be available only in production builds
            config.set('plugins', [
                new webpack.optimize.UglifyJsPlugin({
                    mangle: true,
                    sourceMap: true
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'index',
                    filename: 'assets/js/[name].[hash].js'
                })
            ]);
            break;
        }
        case 'development': {
            //This plugin will be available only in development builds
            config.set('plugins', [
               new SomeRandomWebpackPlugin({/*some options*/})
            ]);
            break;
        }
        default: {
            break;
        }
    }
}
```

##### ELECTRON OPTIONS
For Electron Applications Only. Attach any option to the electronPackagingOptions object. 
See [here](https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options).
```javascript
electronPackagerOptions: {
    name: 'Riko',

    //applications icon  //OS X: .icns  //Windows: .ico
    //get free conversions herehttps://iconverticons.com/online/
    icon: 'src/riko-logo.icns',

    //target platform(s) to build for
    platform: 'all',

    //Enable or disable asar archiving
    asar: true
}
```

Set autoprefixing options. See [here](https://github.com/postcss/autoprefixer#webpack).
```javascript
autoprefixerOptions: { 
    //prefix everything
    browsers: ['> 0%'] 
};
```

HMR Options. Valid in `development` mode only.
```javascript
hotReloadingOptions: {
    //on HMR error a helpful overlay pops up displaying the error message
    //see here: https://webpack.js.org/configuration/dev-server/#devserver-overlay
    overlay: true,
    
    //Override hot module replacement and simply have the page refresh on file change
    browserSyncReloadOnChange: false,

    //Provide an npm package.json script command here to have tests execute on every webpack rebuild.
    //i.e: 'test' would execute as 'npm run test' or 'hot-test' as 'npm run hot-test'
    //To Disable: change to a falsy value
    hotExecuteTestCommand: 'test',

    //Provide an npm package.json script command here to have flow checks execute on every webpack rebuild.
    //i.e: 'flow' would execute as 'npm run flow' or 'flow-test' as 'npm run flow-test'
    //To Disable: change to a falsy value
    hotExecuteFlowTypeCommand: 'default'
};
```

Add specific custom boilerplate path for generating path boilerplate files via the `riko <create>` command.
path must be relative to package.json.
```javascript
customBoilerplatePath: 'src/riko-custom-boilerplates'
```
        
#### Happy Coding :)

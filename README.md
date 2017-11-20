[![RIKO](build-assets/riko-logo.png)](https://github.com/Donmclean/riko)

Modern CLI Build System for creating Javascript Projects (Node, React, React Native & Electron)

[![npm](https://img.shields.io/badge/npm-v6.1.0-blue.svg)](https://www.npmjs.com/package/riko) [![Build Status](https://travis-ci.org/Donmclean/riko.svg?branch=master)](https://travis-ci.org/Donmclean/riko) [![dependencies Status](https://david-dm.org/donmclean/riko/status.svg)](https://david-dm.org/donmclean/riko) [![devDependencies Status](https://david-dm.org/donmclean/riko/dev-status.svg)](https://david-dm.org/donmclean/riko?type=dev) [![Coverage Status](https://coveralls.io/repos/github/Donmclean/riko/badge.svg?branch=master)](https://coveralls.io/github/Donmclean/riko?branch=master) [![Code Climate](https://codeclimate.com/github/Donmclean/riko/badges/gpa.svg)](https://codeclimate.com/github/Donmclean/riko) [![Known Vulnerabilities](https://snyk.io/test/github/Donmclean/riko/badge.svg)](https://snyk.io/test/github/Donmclean/riko) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Donmclean/riko/blob/master/LICENSE) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NVQAJLLBQKUUG) [![DUB](https://img.shields.io/badge/Author-Don%20Mclean-red.svg)](http://donsmclean.com)

Riko is as much a concept of building as it is build system. It is designed to aid developers throughout the project lifecycle as well as increasing their efficiency.
Learn more about the Riko concept [**here**](docs/concept.md)

# INSTALL

- `npm install -g riko`
- `npm install -g riko --unsafe-perm=true --allow-root` (_if permission errors_)

> **Note**: If you receive any additional permission errors, be sure to prepend `sudo` before the command

###### Note: make sure you export your npm bin to $PATH in bash profile 
```bash
PATH="$(npm bin -g):$PATH"
```

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
    - `<run-command> [react-dev, react-prod, react-server, react-prod-server, react-native-launch-android, react-native-android, react-native-ios, electron-dev, electron-prod, electron-server, node-server-dev, node-server-prod]`
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
- Supports [**Yarn**](https://yarnpkg.com/). The new fast, reliable and secure dependency management tool.
- Javascript (_js_,_jsx_) linting via [**eslint**](http://eslint.org/).
- Stylesheet (_sass_, _less_, _css_) linting via [**stylelint**](https://github.com/stylelint/stylelint).
- [**Autoprefixing**](https://github.com/postcss/autoprefixer) for stylesheets.
- [**Browsersync**](https://www.browsersync.io/) functionality by default.
- [**Jest**](https://facebook.github.io/jest/), [**Mocha**](https://mochajs.org/), [**Chai**](http://chaijs.com/) unit testing.

###### - Development Mode: eg: `riko run react-dev` | `riko r electron-dev`

- [**Hot Module Replacement**](https://webpack.github.io/docs/hot-module-replacement.html) for stylesheets (_sass,css,less_) and js (_js,jsx_) sources.
- [**Error proofing**](https://github.com/webpack/webpack-dev-server/issues/522) (on error a helpful overlay pops up displaying the error).
- [**Electron Mode**](http://electron.atom.io/) has the exact same features as **React** setup with [**electron**](http://electron.atom.io/) native OS powers.

###### - Production Mode: `riko run react-prod` | `riko r electron-prod`

- [**Tree Shaking**](https://webpack.js.org/guides/tree-shaking/): Since Riko uses [**Webpack**](https://webpack.js.org) to bundle [**React**](https://facebook.github.io/react/) & [**Electron**](http://electron.atom.io/) projects, it automatically removes unused code to achieve the smallest bundle sizes.
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
        - If this fails you should complete the following instructions [here](https://www.davidbaumgold.com/tutorials/wine-mac/) to package a __windows__ version of your app.

- After running one of the setup commands notice there is a new `src/` folder in the directory. 
- here is where all of your source code will live. From js scripts to stylesheets, etc.

# RIKO CONFIG

- This is where all your build related settings will live. The build system has been created so you rarely have to manage labor intensive build configurations. All you would need to do is customize your `rikoconfig.js` file.

- The `rikoconfig.js` on all platform targets is a function that returns a platform specific config object.

### REACT & ELECTRON CONFIG OPTIONS

##### WEBPACK REQUIRED SETTINGS
###### Use this function to install your link your webpack details to riko.

```javascript
setWebpackConfig: () => {
    //return an object with the following keys: 'webpack', 'webpackDevServer', 'webpackConfig'
    // and an optional 'statsOptions' see more here: https://github.com/webpack/docs/wiki/node.js-api#statstostringoptions
    //i.e:
    // {
    //     webpack: require('webpack'),
    //     webpackDevServer: require('webpack-dev-server'),
    //     webpackConfig: require('../webpack.config.babel'),
    //     statsOptions: {}
    // }

    const webpack = require('webpack');
    const webpackDevServer = require('webpack-dev-server');
    const webpackConfig = require('../webpack.config.babel') || require('../webpack.config');

    return { webpack, webpackDevServer, webpackConfig };
}
```

###### Specific custom boilerplate path for generating path boilerplate files via the `riko <create>` command. Path must be relative to package.json.

```javascript
setCustomBoilerplatePath: () => {
    //return a string which is the relative path to your custom boilerplate directory
    //return false to disable custom boilerplate creation
    return 'src/riko-custom-boilerplates';
}
```

###### Use this function to inject all of your webpack hook events.

```javascript
setWebpackEventHooks: (NODE_ENV) => {
    //return an object with the keys as the event names and the values as the event callback functions
    //see here for more details: https://webpack.js.org/api/compiler/#event-hooks

    //i.e:
    // return {
    //     'before-compile': (compilation, callback) => {
    //         // Do something async on the before-compile event...
    //         callback();
    //     }
    // };

    return {};
},
```

##### ELECTRON OPTIONS
For Electron Applications Only. Attach any option to the electronPackagingOptions object. 
See [here](https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options).
```javascript
setElectronPackagerOptions: () => {
    //return an object containing electron packager options
    //for Electron Applications Only
    //See API for all options here: https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
    return {
        name: 'Riko',

        //applications icon  //OS X: .icns  //Windows: .ico
        //get free conversions herehttps://iconverticons.com/online/
        icon: 'src/riko-logo.icns',

        //target platform(s) to build for
        platform: 'all',

        //Enable or disable asar archiving
        asar: true
    }
}
```

### NODE SERVER CONFIG OPTIONS

main entry file for your node server
```javascript
entryFile: 'src/app.js'
```

Add custom path to your nodemon.json file. See all options [**here**](https://github.com/remy/nodemon#config-files)
```javascript
nodemonJson: 'nodemon.json'
```

Specific custom boilerplate path for generating path boilerplate files via the `riko <create>` command.
Path must be relative to package.json.
```javascript
customBoilerplatePath: 'src/riko-custom-boilerplates'
```
        
#### Happy Coding :)

[![RIKO](build-assets/riko-logo.png)](https://github.com/Donmclean/riko)

Modern CLI Build System for creating Javascript Projects (Node, React, React Native & Electron)

[![npm](https://img.shields.io/badge/npm-v1.0.21-blue.svg)](https://www.npmjs.com/package/riko-cli) [![Build Status](https://travis-ci.org/Donmclean/riko.svg?branch=master)](https://travis-ci.org/Donmclean/riko) [![dependencies Status](https://david-dm.org/donmclean/riko/status.svg)](https://david-dm.org/donmclean/riko) [![devDependencies Status](https://david-dm.org/donmclean/riko/dev-status.svg)](https://david-dm.org/donmclean/riko?type=dev) [![Test Coverage](https://codeclimate.com/github/Donmclean/riko/badges/coverage.svg)](https://codeclimate.com/github/Donmclean/riko/coverage) [![Code Climate](https://codeclimate.com/github/Donmclean/riko/badges/gpa.svg)](https://codeclimate.com/github/Donmclean/riko) [![Known Vulnerabilities](https://snyk.io/test/github/Donmclean/riko/badge.svg)](https://snyk.io/test/github/Donmclean/riko) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Donmclean/riko/blob/master/LICENSE) [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NVQAJLLBQKUUG) [![DUB](https://img.shields.io/badge/Author-Don%20Mclean-red.svg)](http://donsmclean.com)

Riko is as much a concept of building as it is build system. It is designed to aid developers throughout the project lifecycle as well as increasing their efficiency.

# INSTALL

- `npm install -g riko-cli`

# COMMANDS

###### Setup a new (highly customizable) project with defaults
- `riko s|setup`
    - `<project-type> ['react', 'react-native', 'electron', 'node-server']`
    - `<project-name> 'Awesome New Web Project'`
    - example 1: `riko setup react Awesome New React Project`
    - example 2: `riko s electron Amazing New Electron Project`

# FEATURES

- Supports the development of JS Modules, React [**Web**](https://facebook.github.io/react/), [**Mobile**](https://facebook.github.io/react-native/) & [**Electron**](http://electron.atom.io/) Applications.
- Supports compilation of [**es6 js**](http://es6-features.org/) & [**jsx**](https://facebook.github.io/react/docs/jsx-in-depth.html) source files.
- Supports compilation of [**pug**](https://pugjs.org) template files to html.
- Supports compilation of [**sass**](http://sass-lang.com/), [**less**](http://lesscss.org/), and [**css**](http://www.w3schools.com/css/) stylesheets.
- Supports generation of [**Source mapping**](https://www.npmjs.com/package/source-map) for stylesheets and js sources.
- Supports [**Flow**](https://flowtype.org/) Static Type Checking out of the box.
- Supports [**Yarn**](https://yarnpkg.com/). The new fast, reliable, and secure dependency management.
- Javascript (_js_,_jsx_) linting via [**eslint**](http://eslint.org/).
- Stylesheet (_sass_, _less_, _css_) linting via [**stylelint**](https://github.com/stylelint/stylelint).
- [**Autoprefixing**](https://github.com/postcss/autoprefixer) for stylesheets.
- [**Browsersync**](https://www.browsersync.io/) functionality by default.
- [**Jest**](https://facebook.github.io/jest/), [**Mocha**](https://mochajs.org/), [**Chai**](http://chaijs.com/) unit testing.
- [**Selenium Testing**](http://www.seleniumhq.org/) via [**Nightwatch JS**](http://nightwatchjs.org/) & [**Browserstack**](https://www.browserstack.com/)
- [**Bundle Visualizer**](https://chrisbateman.github.io/webpack-visualizer/): see the build product of your js sources & dependencies via current git SHA as url. 
    - eg: `localhost:3000/4bd933dd0d4ec24302ffb3e92dde767d31f7e392.html`
- [**Source File Hashing**](#_): hashes build sources to control caching 
    - eg: `index.html?405kjdjsd7ed89a68ac` `styles.min.css?405eccffee7ed89a68ac` `bundle.js?405eccffee7ed89a68ac`

> NOTE: All `npm` commands can be executed with `yarn`

###### - Development Mode: `npm run dev`

- [**Hot Module Replacement**](https://webpack.github.io/docs/hot-module-replacement.html) for stylesheets (_sass,css,less_) and js (_js,jsx_) sources.
- [**Error proofing**](https://github.com/webpack/webpack-dev-server/issues/522) (on error a helpful overlay pops up displaying the error).
- [**Remote Debugging**](http://vorlonjs.com/): Debug your application on almost any device.

###### - Production Mode: `npm run prod`

- [**Asset Copying**](#_): Specify the output directories or your files. (eg: _src/images_  -->  _dist/assets/images_). 
- [**Source Minification**](#_): Optimize/Minify stylesheets and js files.
- [**Image Minification**](https://github.com/tcoopman/image-webpack-loader): Optimize/Minify png, jpg, gif and svg images.
- [**Shell Script Integration**](https://www.npmjs.com/package/webpack-shell-plugin): run shell scripts on build start, end and/or exit.

###### - Electron Mode: `npm run electron`

- [**Electron Mode**](http://electron.atom.io/) has the same features as web just different commands.
- [**Hot Module Replacement**](https://webpack.github.io/docs/hot-module-replacement.html) for stylesheets (_sass,css,less_) and js (_js,jsx_) sources.
- [**Error proofing**](https://github.com/webpack/webpack-dev-server/issues/522) (on error a helpful overlay pops up displaying the error).
- [**Remote Debugging**](http://vorlonjs.com/): Debug your application on almost any device.

# CAVEATS

- FOUC (Flash of Unstyled Content)

    - To make the hot reloading of CSS work, we are not extracting CSS in development. Ideally, during server rendering, we will be extracting CSS, and we will get a .css file, and we can use it in the html template. That's what we are doing in production. 
    - In development, after all scripts get loaded, react loads the CSS as BLOBs. That's why there is a second of FOUC in development.
- No Support for Windows/Linux/Ubuntu Development

    - This Build System is not tested for development on Windows, Linux, or Ubuntu and 
    therefore does not support any those Operating Systems.

# USAGE

- After setting up your project. `cd` into your project then run `npm install` or `yarn` (_highly recommended_) if you have [yarn](https://yarnpkg.com/) installed
- After installation you can run either of the following two options: 
    - `npm run setup` to setup the most basic content to jump start your application.
    - `npm run setup-js` to setup a non html templated project. For example a js module or library project.
    - `npm run setup-mobile` to setup sample content of a react native mobile application.<br/><br/>
        **NOTE: _WHEN SETTING UP A MOBILE (REACT NATIVE) APP ON MAC_**<br/>
        - You must have [xcode](https://developer.apple.com/xcode), a valid [iOS simulator](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/iOS_Simulator_Guide/Introduction/Introduction.html), [Android Studio](https://developer.android.com/studio/index.html), [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and [JRE](https://java.com/en/download/) installed.<br/>
        - You must have [brew](http://brew.sh/) installed.<br/>
    - `npm run setup-electron` to setup sample content of an electron application.<br/><br/>
        **NOTE: _WHEN SETTING UP AN ELECTRON APP ON MAC_**<br/>
        - You must have [xcode](https://developer.apple.com/xcode) installed.<br/>
        - You must successfully run `sh src/electron.sh` to be able to package a windows version of your app.<br/>
        - If this fails you should complete the following instructions:<br/>
        [Install Wine on Mac](https://www.davidbaumgold.com/tutorials/wine-mac/) to package a windows version of your app.
 
> Run `npm run setup-js` to start create a js module/library project.<br/> 
> Or run a `npm run setup` when you're ready to start a web application.<br/> 
> Or run a `npm run setup-mobile` when you're ready to start a mobile application.<br/> 
> Or run a `npm run setup-electron` if you're building an electron application.
 
- After running one of the setup commands notice there is a new `src/` folder in the directory. 
- here is where all of your source code will live. From js source/test scripts to stylesheets to custom eslinters etc.

###### Eslint
- If you wish to edit eslint rules or add plugins etc, simply edit the `src/__linters/eslintrc.js` file. See [**here**](http://eslint.org/docs/user-guide/configuring).
- **IMPORTANT**: Do not edit the `.eslintrc.js` in the `test-riko/` directory. It's for the build only.

###### Babel
- If you wish to edit babel rules or add plugins etc, simply edit the top level `.babelrc` file. See [**here**](https://babeljs.io/docs/plugins/).
- **IMPORTANT**: removing certain items might have unintended consequences.
eg: removing the `react` preset will break flow typechecking etc.
```text
{
  "presets": ["react","es2015"], //Required for flow type checking & developing in ECMAScript 6
  "plugins": [
    "transform-runtime" //Required polyfilling code without polluting globals
  ]
}
```


###### Flow
- If you wish to edit configuration for the flow static type checker, simply edit the top level `.flowconfig` file. See [**here**](https://flowtype.org/docs/advanced-configuration.html).

#### **THE 'rikoconfig.js' FILE**

- **NOTE**: This is **NOT** available if you ran `npm run setup-mobile`. The `rikoconfig.js` is only for **JS Module, WEB & Electron Applications.**
- This is where all your settings live. The build system has been created so you rarely have to enter the webpack.config.js file.
- Here's the run down:

Root Directory. **IMPORTANT! DO NOT OVERRIDE!**
```javascript
const baseDir                   = path.resolve(__dirname, '../'); //IMPORTANT! DO NOT OVERRIDE!
```
Source Directory.
```javascript
config.srcDir                   = baseDir+"/src"; //IMPORTANT! DO NOT OVERRIDE!
```

That is your base/root & source directories; They're needed to keep the paths below relative. it's highly recommended that you keep this as is.

##### CUSTOM OPTIONS

**IMPORTANT!** All paths/directories should be relative to 'baseDir' unless specified otherwise. 
Also all values are required to exist and be same file type as in the following examples.
eg: `baseDir+'/path'`

Alias for your web application
```javascript
config.moduleName               = 'riko';
```

Output location for all of your src files after a production build
```javascript
config.destDir                  = baseDir+"/dist"; 
```

Location for all for temp files to be stored on production build (this will be automatically deleted)
```javascript
config.tempDir                  = baseDir+"/temp";
```

Port your wish to serve your files on in dev mode
```javascript
config.EXPRESS_PORT             = 3000;
```

Location from which to serve production built files. (should* be same as destDir)
```javascript
config.EXPRESS_ROOT             = config.destDir; 
```

Absolute paths to the configs/json files
```javascript
config.eslintConfig             = baseDir+'/src/__linters/.eslintrc.js';
config.stylelintConfig          = baseDir+'/src/__linters/.stylelintrc.yaml';
config.packageJson              = baseDir+'/package.json';
config.nightwatchConfig         = baseDir+'/nightwatchconfig.js';
```

##### ELECTRON OPTIONS
For Electron Applications Only. Attach any option to the electronPackagingOptions object. 
See [here](https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options).
```javascript
config.electronPackagingOptions = {};
```

##### JS OPTIONS
The name that you want your output bundle js file to be.
```javascript
config.js_main_file_name        = 'bundle.js';
```

Entry file for your web app. See [here](https://webpack.github.io/docs/configuration.html#entry)
```javascript
config.js_main_entry_path       = baseDir+'/src/js/'+config.js_main_file_name;
```

Relative path for your js bundle after prod build 
```javascript
config.js_output_path           = 'assets/js';
```

Any external scripts you'd like to load via cdn should be inserted here.
Notice the 'async' & 'defer' options. 
See [here](http://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html)
Also if you don't want to load any scripts. Just leave the array empty.
```javascript
config.js_external_scripts      = [
    {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
        async: false,
        defer: false
    },
    {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js',
        async: false,
        defer: false
    },
    {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.15.0/lodash.js',
        async: true,
        defer: false
    }
];
```

Any configurations that you would like to be available in your application goes here.
These values will be availbe when your source code builds and is runs.

**IMPORTANT!!! ALL VALUES OF THE FOLLOWING** 'value' key **MUST BE JSON STRINGIFIED**
```javascript
config.js_runtime_configs      = [
    {
        key: 'process.env',
        value: {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
    }
];
```

##### STYLE OPTIONS
The name that you want your output stylesheet bundle to be
```javascript
config.styles_main_file_name    = 'styles.min.css';
```

Any external stylesheets you'd like to load via cdn should be inserted here.
```javascript
config.styles_external_stylesheets  = [
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css'
];
```

##### TEMPLATE OPTIONS
The name that you want your main output html file to be
```javascript
config.template_main_file_name  = 'index.html';
```

An html file with visual stats of the build will be added to each incremental build.
Specify the name for it here. The name will then be follow by a '-' the your current Git version
eg: `[name]-4bd933dd0d4ec24302ffb3e92dde767d31f7e392.html`
See: [here](https://chrisbateman.github.io/webpack-visualizer)
```javascript
config.template_stats_file_name = '';
```

Absolute path for your main source template.
```javascript
config.template_src_path        = baseDir+'/src/templates/index.pug';
```

If you're using a custom template engine 'OTHER THAN' pug or html
add as string below.
See [here](https://www.npmjs.com/package/template-html-loader) and
[here](https://github.com/tj/consolidate.js)
```javascript
config.template_engine          = ''; //eg: hbs, handlebars, ejs, mustache
```

Google Analytics is automatically setup in your setup `src/templates/index.pug` file.
Simply apply options. 
If you do not wish to use GA comment-out/remove the functionality `src/templates/in index.pug`
```javascript
config.gaEnable                 = true;
config.gaTrackingId             = 'UA-XXXXX-Y';
config.gaPageViewOnLoad         = true;
```

##### MEDIA OPTIONS

**IMPORTANT!!! (THESE ARE ALREADY RELATIVE TO OUTPUT OR DESTINATION).
ALSO DO NOT ADD TRAILING SLASH '/'** 
<br/>eg: incorrect - `assets/audio/`
<br/>eg: correct - `assets/audio`

```javascript
config.media_audio_output_path  = 'assets/audio';
config.media_files_output_path  = 'assets/files'; //pdfs, docs, etc
config.media_fonts_output_path  = 'assets/fonts';
config.media_images_output_path = 'assets/images';
config.media_video_output_path  = 'assets/video';
```

**IMPORTANT!!!** Use absolute path here. Leave empty string if you don't want to use. 
```javascript
config.media_favicon_path       = baseDir+'/src/media/images/riko-favicon.png';
```

Image optimization options. NOTE: only valid on prod build. Leave empty if you don't want to use.
See [here](https://github.com/Klathmon/imagemin-webpack-plugin).
```javascript
config.imageminConfig = {
    // progressive: true,
    pngquant:{
        quality: '65-90',
        speed: 4
    },
    svgo:{
        plugins: [
            {
                removeViewBox: false
            },
            {
                removeEmptyAttrs: false
            }
        ]
    }
};
```

##### VENDOR OPTIONS
**IMPORTANT!!!** all module dependencies that are NOT npm installed modules
<br/>eg: `require('src/vendor/jquery.min.js')`
must be specified with it's valid ABSOLUTE path.
```javascript
config.externalModulePaths = {
    //eg: $ : 'src/vendor/jquery.min.js'
};
```

Add vendor dependencies that you wish to expose globally but not expose
to global/window object here.

If using an npm module. Use the same way as you would in a require statement.
<br/>`eg: _ : 'lodash'`

But if using a vendor dependency. Use the MATCHING KEY from `config.externalModulePaths`.
<br/>**IMPORTANT!!! DO NOT USE AN ABSOLUTE PATH.**
```javascript
//eg:   config.externalModulePaths  = {$ : 'src/vendor/jquery.min.js'};
//      config.externalModules      = {$: '$'};
```

Notice how the '$' value of `externalModules` matches the key $ of `externalModulePaths`.
```javascript
config.externalModules = {
    //eg: $ : 'jquery'
    //or: $ : '$' //if you're not using the npm module. Make sure path is mapped in config.externalModulePaths
};
```

To add vendor dependencies and expose them to global/window object simply use the expose-loader
`// eg: require("expose-loader?_!lodash");`
<br/>See: [here](https://github.com/webpack/expose-loader).

##### TEST OPTIONS

provide [browserstack](https://www.browserstack.com/) account [info](https://www.browserstack.com/accounts/settings) here to for selenium testing to work<br>
**IMPORTANT**: these are required fields for running your [nightwatch](http://nightwatchjs.org/) selenium tests via: `npm run test-selenium`.
```javascript
config.browserstackUsername = 'usernameGoesHere';
config.browserstackAccessKey = 'accessKeyGoesHere';
```
Enable this to have tests execute on every webpack rebuild.
```javascript
config.hotExecuteTests = true;
```

##### EXTRA OPTIONS

Define which sourcemap type here.
See [here](https://webpack.github.io/docs/configuration.html#devtool).
```javascript
config.sourcemapType = 'inline-source-map';
```
Enable of disable sourcemaps based on environment.
```javascript
config.sourcemapDev = true;
config.sourcemapProd = true;
```

Enable remote debugging via vorlon.js very useful for debugging on mobile devices.
Simply visit `localhost:1337` or browsersync's `[externalIp]:1337` in dev mode via `npm run dev`.
<br/>See here: [vorlon js](http://vorlonjs.com)
<br/>**WARNING**: js sourcemap info will not be able in browser console if enabled in dev mode.
<br/>**IMPORTANT!** this is only recommended if you're debugging a specific device or not using sourcemaps.
```javascript
config.enableRemoteDebugging   = true;
```

Set autoprefixing options here.
See [here](https://github.com/postcss/autoprefixer#webpack).
```javascript
config.autoprefixerOptions     = { browsers: ['> 0%'] }; //prefix all
```

Set webpack middleware options for dev mode.
See [here](https://github.com/glenjamin/webpack-hot-middleware#config).
```javascript
config.hotReloadingOptions     = {
    overlay: true,
    reload: true,
    noInfo: false,
    quiet: false
};
```

Override hot module replacement and simply have the page refresh on file change.
```javascript
config.BrowserSyncReloadOnChange = true;
```

Add any shell command to execute around the production build lifecycle `npm run prod`.
<br/>**IMPORTANT!** must be and array. eg: `[ 'echo hello world' ]`;
```javascript
config.onBuildStartShellCommands = [];
config.onBuildEndShellCommands = [];
config.onBuildExitShellCommands = [];
```

Important linting options for prod build.
```javascript
config.failOnProdBuildJsError = true;
config.failOnProdBuildStyleError = false;
config.eslintQuietMode = false; //set false to display warnings based on your eslint config
```

#USAGE - CONTINUED

- After configuring everything in the `rikoconfig.js` file to your liking, you should now run the following commands: 
    - `npm run test-build`
        - This runs a test on the riko build to ensure that the build in still in working order.
        - You should also run this command regularly after making alterations to any of the config files.
    
    - `npm run prod`
        - This will execute a production build on your current src/ folder.
        - If this passes you should be in good shape to test it out.
        
    - `npm run electron-prod`
        - This will execute a production build on your current src/ folder.
        - It will create packager an electron application based on the configurations specified in the rikoconfig.js (electronPackagingOptions)
        
    - `npm run prod-server`
        - This will fire up an express server for you to test out your new prod build.
        - Remember to check for the visualizer file based on your git version to really see the build details.
        
    - `npm run server`
        - This will fire up a browsersync server for you to test out your new prod build.
        - Remember to check for the visualizer file based on your git version to really see the build details.
        - Also if you have remote debugging enabled you can visit on port 1337 via localhost or browsersync's external IP.
        
    - `npm run dev`
        - This will fire up a browsersync server for you with your specified hot reloading options.
        - It will watch all files attached down the tree of your specified entry file and "hot replace or reload" on change.
    
    - `npm run electron`
        - This will fire up a browsersync server for you with your specified hot reloading options in a native Mac/Windows/Linux window.
        - It will watch all files attached down the tree of your specified entry file and "hot replace or reload" on change
        - Get the right formatted logo `.icns` or `.ico` for your electron app [here](https://iconverticons.com/online/).
            
    - `npm run mobile-ios`
        - This will fire up an ios emulator and debugger on `localhost:8081/debugger-ui`.
        - It will watch all files attached down the tree of the specified entry file (`index.ios.js`) and you'll be able to enable or disable "hot replace or live reload" on change.
        - **WARNING**: Do not run this while Docker or any other virtual machine is running. 
        
    - `npm run mobile-android`
        - This will fire up an android emulator and debugger on `localhost:8081/debugger-ui`.
        - It will watch all files attached down the tree of the specified entry file (`index.android.js`) and you'll be able to enable or disable "hot replace or live reload" on change.
        - If this fails try running again or see [here](https://facebook.github.io/react-native/releases/0.34/docs/getting-started.html).
        - **WARNING**: Do not run this while Docker or any other virtual machine is running.
     
    - `npm run mobile-test`
        - Execute any jest tests. The default jest test directory is: `src/__tests__`. You can make any jest configurations changes via the `jestconfig.json`.
      
    - `npm run test-selenium`
        - To utilize this command you must have a [**browserstack**](https://www.browserstack.com) account.
        - Next you should retrieve your __Username__ & __Access Key__ info from [**settings**](https://www.browserstack.com/accounts/settings).
        - Once your have this can then update the nightwatchconfig.js file located in the base directory.
        - eg: `browserstack.user: browserstackuser`; Replace all `browserstackuser` with your __Username__ value.
        - eg: `browserstack.key: browserstackkey`; Replace all `browserstackkey` with your __Access Key__ value.
        - Execute any selenium tests via [**nightwatch js**](http://nightwatchjs.org/guide#writing-tests) End to End tests in `src/__tests-selenium`.
        - **NOTE**: only valid for web and electron projects 
    
    - `npm run test-jest`
        - Execute any jest tests. The default jest test directory is: `src/__tests__`. You can make any jest configurations changes via the `jestconfig.json`.

    - `npm run flow`
        - Executes flow to type check your js/jsx files.
        - For advanced configuration feel free to edit the `.flowconfig` file. See [**here**](https://flowtype.org/docs/advanced-configuration.html)
        - NOTE: js/jsx files must have the `@flow` comment at the very top of the file to be type checked. see more about flow [**here**](https://flowtype.org/docs/getting-started.html)

    - `npm test` or `npm run test` 
        - Runs full test suite. (all test commands)
        - All test coverage information will be located in: '[root]/test-coverage'
    
    - `npm start` 
       - Executes a production build. Then fires up a production ready server on the `rikoconfig.js` specified express port.
   
        
#### Happy Coding :)

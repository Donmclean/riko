[![RIKO](./test-riko/riko-favicon.png)](https://github.com/Donmclean/riko)

Webpack Build System for React JS (Web & Electron Apps)

[![Build Status](https://travis-ci.org/Donmclean/riko.svg?branch=master)](https://travis-ci.org/Donmclean/riko) [![dependencies Status](https://david-dm.org/donmclean/riko/status.svg)](https://david-dm.org/donmclean/riko) [![devDependencies Status](https://david-dm.org/donmclean/riko/dev-status.svg)](https://david-dm.org/donmclean/riko?type=dev) [![Test Coverage](https://codeclimate.com/github/Donmclean/riko/badges/coverage.svg)](https://codeclimate.com/github/Donmclean/riko/coverage) [![Code Climate](https://codeclimate.com/github/Donmclean/riko/badges/gpa.svg)](https://codeclimate.com/github/Donmclean/riko) [![DUB](https://img.shields.io/dub/l/vibe-d.svg?maxAge=2592000)](https://github.com/Donmclean/riko/blob/master/LICENSE) [![DUB](https://img.shields.io/badge/Author-Don%20Mclean-red.svg)](http://donsmclean.com)

#FEATURES

- Supports the development of React [**Web**](https://facebook.github.io/react/) & [**Electron**](http://electron.atom.io/) Applications
- Supports compilation of [**js**](https://www.javascript.com/) & [**jsx**](https://facebook.github.io/react/docs/jsx-in-depth.html) source files
- Supports compilation of [**pug**](https://pugjs.org) template files to html
- Supports compilation of [**sass**](http://sass-lang.com/), [**less**](http://lesscss.org/), and [**css**](http://www.w3schools.com/css/) stylesheets
- Supports generation of [**Source mapping**](https://www.npmjs.com/package/source-map) for stylesheets and js sources
- Javascript (_js_,_jsx_) linting via [**eslint**](http://eslint.org/)
- Stylesheet (_sass_, _less_, _css_) linting via [**stylelint**](https://github.com/stylelint/stylelint)
- [**Autoprefixing**](https://github.com/postcss/autoprefixer) for stylesheets
- [**Browsersync**](https://www.browsersync.io/) functionality by default
- [**Jest**](https://facebook.github.io/jest/), [**Mocha**](https://mochajs.org/), [**Chai**](http://chaijs.com/) unit testing.
- [**Bundle Visualizer**](https://chrisbateman.github.io/webpack-visualizer/): see the build product of your js sources & dependencies via current git SHA as url 
    - eg: `localhost:3000/4bd933dd0d4ec24302ffb3e92dde767d31f7e392.html`
- [**Source File Hashing**](#_): hashes build sources to control caching 
    - eg: `index.html?405kjdjsd7ed89a68ac` `styles.min.css?405eccffee7ed89a68ac` `bundle.js?405eccffee7ed89a68ac`

######- Development Mode: `npm run dev`

- [**Hot Module Replacement**](https://webpack.github.io/docs/hot-module-replacement.html) for stylesheets (_sass,css,less_) and js (_js,jsx_) sources
- [**Error proofing**](https://github.com/webpack/webpack-dev-server/issues/522) (on error a helpful overlay pops up displaying the error)
- [**Remote Debugging**](http://vorlonjs.com/): Debug your application on almost any device.

######- Production Mode: `npm run prod`

- [**Asset Copying**](#_): Specify the output directories or your files. (eg: _src/images_  -->  _dist/assets/images_) 
- [**Source Minification**](#_): Optimize/Minify stylesheets and js files
- [**Image Minification**](https://github.com/tcoopman/image-webpack-loader): Optimize/Minify png, jpg, gif and svg images
- [**Shell Script Integration**](https://www.npmjs.com/package/webpack-shell-plugin): run shell scripts on build start, end and/or exit

######- Electron Mode: `npm run electron`

- [**Electron Mode**](http://electron.atom.io/) has the same features as web just different commands.
- [**Hot Module Replacement**](https://webpack.github.io/docs/hot-module-replacement.html) for stylesheets (_sass,css,less_) and js (_js,jsx_) sources
- [**Error proofing**](https://github.com/webpack/webpack-dev-server/issues/522) (on error a helpful overlay pops up displaying the error)
- [**Remote Debugging**](http://vorlonjs.com/): Debug your application on almost any device.

#CAVEATS

- FOUC (Flash of Unstyled Content)

    - To make the hot reloading of CSS work, we are not extracting CSS in development. Ideally, during server rendering, we will be extracting CSS, and we will get a .css file, and we can use it in the html template. That's what we are doing in production. 
    - In development, after all scripts get loaded, react loads the CSS as BLOBs. That's why there is a second of FOUC in development.

#INSTALL

- run `git clone https://github.com/donmclean/riko.git`
- cd into the cloned directory by running `cd riko`
- run `npm install`
- grab ~~coffee~~ a redbull

#USAGE

- After installation you can run either of the following two options: 
    - `npm run setup` to setup the most basic content to jump start your application.
    - `npm run setup-demo` to setup demo content to get a better sense of how testing, asset loading etc works within the build system.
    - `npm run setup-electron` to setup sample content of an electron application.
 
> It's recommended that you run a `npm run setup-demo` first and get a good feel for working with the build system. 
> Then run a `npm run setup` when you're ready to start your application.
> Or run a `npm run setup-electron` if you're building an electron application.
 
- After running one of the setup commands notice there is a new `src/` folder in the directory. 
- here is where all of your source code will live. From js source/test scripts to stylesheets to custom eslinters etc.

#### **THE 'custom_config.js' FILE**

- This is where all your settings live. The build system has been created so you rarely have to enter the webpack.config.js file.
- Here's the run down:

```javascript
//Root Directory
const baseDir                   = path.resolve(__dirname, '../'); //IMPORTANT! DO NOT OVERRIDE!

//Source Directory
config.srcDir                   = baseDir+"/src"; //IMPORTANT! DO NOT OVERRIDE!
```

That is your base/root & source directories; They're needed to keep the paths below relative. it's highly recommended that you keep this as is.

##### CUSTOM OPTIONS

```javascript
//IMPORTANT! All paths/directories should be relative to 'baseDir' unless specified otherwise. 
//Also all values are required to exist and be same file type as in the following examples.
// eg: baseDir+'/path'

//alias for your web application
config.moduleName               = 'riko';

//output location for all of your src files after a production build
config.destDir                  = baseDir+"/dist"; 

//location for all for temp files to be stored on production build (this will be automatically deleted)
config.tempDir                  = baseDir+"/temp";

//port your wish to serve your files on in dev mode
config.EXPRESS_PORT             = 3000;

//location of which to server production built files. (should* be same as destDir)
config.EXPRESS_ROOT             = config.destDir; 

//absolute paths to the configs/json files
config.eslintConfig             = baseDir+'/src/__linters/.eslintrc';
config.stylelintConfig          = baseDir+'/src/__linters/.stylelintrc.yaml';
config.packageJson              = baseDir+'/package.json';
```

##### ELECTRON OPTIONS
```javascript
//for Electron Applications Only. Attach any option to the electronPackagingOptions object. 
//See here: https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options 

config.electronPackagingOptions = {};
```

##### JS OPTIONS

```javascript
//The name that you want your output bundle js file to be
config.js_main_file_name        = 'bundle.js';

//Entry file for your web app. see: https://webpack.github.io/docs/configuration.html#entry
config.js_main_entry_path       = baseDir+'/src/js/'+config.js_main_file_name;

//Relative path for your js bundle after prod build 
config.js_output_path           = 'assets/js';

//Any external scripts you'd like to load via cdn should be inserted here.
//Notice the 'async' & 'defer' options. 
//See: http://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html
//Also if you don't want to load any scripts. Just leave the array empty.
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

//Any configurations that you would like to be available in your application goes here.
//These values will be availbe when your source code builds and is runs.
//IMPORTANT!!! ALL VALUES OF THE FOLLOWING 'value' key *MUST BE JSON STRINGIFIED*
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
```javascript
//The name that you want your output stylesheet bundle to be
config.styles_main_file_name    = 'styles.min.css';

//Any external stylesheets you'd like to load via cdn should be inserted here.
config.styles_external_stylesheets  = [
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css'
];
```

##### TEMPLATE OPTIONS
```javascript
//The name that you want your main output html file to be
config.template_main_file_name  = 'index.html';

//An html file with visual stats of the build will be added to each incremental build.
//specify the name for it here. The name will then be follow by a '-' the your current Git version
//eg: [name]-4bd933dd0d4ec24302ffb3e92dde767d31f7e392.html
//See: https://chrisbateman.github.io/webpack-visualizer/
config.template_stats_file_name = '';

//Absolute path for your main source template.
config.template_src_path        = baseDir+'/src/templates/index.pug';

//if you're using a custom template engine 'OTHER THAN' pug or html
//add as string below.
//https://www.npmjs.com/package/template-html-loader
//https://github.com/tj/consolidate.js
config.template_engine          = ''; //eg: hbs, handlebars, ejs, mustache

//Google Analytics is automatically setup in your setup src/templates/index.pug file.
//Simply apply options. 
//If you do not wish to use GA comment-out/remove the functionality src/templates/in index.pug
config.gaEnable                 = true;
config.gaTrackingId             = 'UA-XXXXX-Y';
config.gaPageViewOnLoad         = true;
```

##### MEDIA OPTIONS
```javascript
// IMPORTANT!!! (THESE ARE ALREADY RELATIVE TO OUTPUT OR DESTINATION)
// ALSO DO NOT ADD TRAILING SLASH '/' eg: assets/audio/

config.media_audio_output_path  = 'assets/audio';
config.media_files_output_path  = 'assets/files'; //pdfs, docs, etc
config.media_fonts_output_path  = 'assets/fonts';
config.media_images_output_path = 'assets/images';
config.media_video_output_path  = 'assets/video';

// IMPORTANT!!! Use absolute path here. Leave empty string if you don't want to use. 
config.media_favicon_path       = baseDir+'/src/media/images/riko-favicon.png';

//Image optimization options. NOTE: only valid on prod build. Leave empty if you don't want to use.
//See: https://github.com/Klathmon/imagemin-webpack-plugin
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
```javascript
//Add vendor dependencies here. Makes the modules available throught your source files.
//Be sure to add it as a global variable to your eslint config to void any linting errors.
config.externalModules = {
    //eg: $ : 'jquery'
    //eg: _ : 'lodash'
};

```

##### EXTRA OPTIONS
```javascript
//Define which sourcemap type here.
//https://webpack.github.io/docs/configuration.html#devtool
config.sourcemapType = 'inline-source-map';

//Enable of disable sourcemaps based on environment.
config.sourcemapDev = true;
config.sourcemapProd = true;

//Enable remote debugging via vorlon.js very useful for debugging on mobile devices.
//Simply visit localhost:1337 or browsersync's [externalIp]:1337 in dev mode (npm run dev)
//See: http://vorlonjs.com/
//WARNING: js sourcemap info will not be able in browser console if enabled in dev mode
//IMPORTANT! this is only recommended if you're debugging a specific device or not using sourcemaps.
config.enableRemoteDebugging   = true;


//Set autoprefixing options here.
//See: https://github.com/postcss/autoprefixer#webpack
config.autoprefixerOptions     = { browsers: ['> 0%'] }; //prefix all

//Set webpack middleware options for dev mode
//See: https://github.com/glenjamin/webpack-hot-middleware#config
config.hotReloadingOptions     = {
    overlay: true,
    reload: true,
    noInfo: false,
    quiet: false
};

//Override hot module replacement and simply have the page refresh on file change
config.BrowserSyncReloadOnChange = true;

//Add any shell command to execute around the production build lifecycle (npm run prod).
//IMPORTANT! must be and array. eg: [ echo 'hello world' ];
config.onBuildStartShellCommands = [];
config.onBuildEndShellCommands = [];
config.onBuildExitShellCommands = [];

// Important linting options for prod build.
config.failOnProdBuildJsError = true;
config.failOnProdBuildStyleError = false;
config.eslintQuietMode = false; //set false to display warnings based on your eslint config
```

#USAGE - CONTINUED

- After configuring everything in the `custom_config.js` file to your liking, you should now run the following commands: 
    - `npm run test-build`
        - This runs a test on the riko build to ensure that the build in still in working order.
        - You should also run this command regularly after making alterations to any of the config files.
    
    - `npm run prod`
        - This will execute a production build on your current src/ folder.
        - If this passes you should be in good shape to test it out.
        
    - `npm run electron-prod`
        - This will execute a production build on your current src/ folder.
        - It will create packager an electron application based on the configurations specified in the custom-config.js (electronPackagingOptions)
        
    - `npm run prod-server`
        - This will fire up an express server for you to test out your new prod build.
        - Remember to check for the visualizer file based on your git version to really see the build details.
        
    - `npm run server`
        - This will fire up a browsersync server for you to test out your new prod build.
        - Remember to check for the visualizer file based on your git version to really see the build details.
        - Also if you have remote debugging enabled you can visit on port 1337 via localhost or browsersync's external IP.
        
    - `npm run dev`
        - This will fire up a browsersync server for you with your specified hot reloading options.
        - It will watch all files attached down the tree of your specified entry file and "hot replace or reload" on change
    
    - `npm run electron`
        - This will fire up a browsersync server for you with your specified hot reloading options in a native Mac/Windows/Linux window.
        - It will watch all files attached down the tree of your specified entry file and "hot replace or reload" on change
    
    - `npm run test-jest`
        - Execute any jest tests. The default jest test directory is: `src/__tests__`. You can change this via the package.json if you wish.

    - `npm test` or `npm run test` 
        - Runs full test suite. (all test commands)
        - All test coverage information will be located in: '[root]/test-coverage'
        
#### Happy Coding :)

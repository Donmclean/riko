[![RIKO](./test-riko/riko-favicon.png)](https://github.com/Donmclean/riko)

Webpack Build System for React JS

[![Build Status](https://travis-ci.org/Donmclean/riko.svg?branch=master)](https://travis-ci.org/Donmclean/riko) [![dependencies Status](https://david-dm.org/donmclean/riko/status.svg)](https://david-dm.org/donmclean/riko) [![devDependencies Status](https://david-dm.org/donmclean/riko/dev-status.svg)](https://david-dm.org/donmclean/riko?type=dev) [![Coverage Status](https://coveralls.io/repos/github/Donmclean/riko/badge.svg?branch=master)](https://coveralls.io/github/Donmclean/riko?branch=master)


#FEATURES

- Supports compilation of [**js**](https://www.javascript.com/) & [**jsx**](https://facebook.github.io/react/docs/jsx-in-depth.html) source files
- Supports compilation of [**html**](http://www.w3schools.com/html/), [**pug**](https://pugjs.org), [**handlebars**](http://handlebarsjs.com/), [**mustache**](https://github.com/janl/mustache.js/) and [**ejs**](http://www.embeddedjs.com/) template files 
- Supports compilation of [**sass**](http://sass-lang.com/), [**less**](http://lesscss.org/), and [**css**](http://www.w3schools.com/css/) stylesheets.
- Supports generation of [**Source mapping**](https://www.npmjs.com/package/source-map) for stylesheets and js sources
- Javascript (_js_,_jsx_) linting via [**eslint**](http://eslint.org/)
- Stylesheet (_sass_, _less_, _css_) linting via [**stylelint**](https://github.com/stylelint/stylelint)
- [**Autoprefixing**](https://github.com/postcss/autoprefixer) for stylesheets
- [**Browsersync**](https://www.browsersync.io/) functionality by default
- [**Jest**](https://facebook.github.io/jest/), [**Mocha**](https://mochajs.org/), [**Chai**](http://chaijs.com/) or any unit testing framework supported by [**Karma JS Test Runner**](https://karma-runner.github.io/1.0/index.html)
- [**Nightwatch JS Selenium Testing**](http://nightwatchjs.org/): run selenium tests in numerous browsers & environments. 
Also supports browserstack for running multiple test suites. 
- [**Bundle Visualizer**](https://chrisbateman.github.io/webpack-visualizer/): see the build product of your js sources & dependencies via current git SHA as url 
(eg: _localhost:3000/4bd933dd0d4ec24302ffb3e92dde767d31f7e392.html_). 

######- Development Mode: `npm run dev`

- [**Hot Module Replacement**](https://webpack.github.io/docs/hot-module-replacement.html) for stylesheets (_sass,css,less_) and js (_js,jsx_) sources
- [**Error proofing**](https://github.com/webpack/webpack-dev-server/issues/522) (on error a helpful overlay pops up displaying the error)

######- Production Mode: `npm run prod`

- [**Asset Copying**](): Specify the output directories or your files. (eg: _src/images_  -->  _dist/assets/images_) 
- [**Source Minification**](): Optimize/Minify stylesheets and js files.
- [**Image Minification**](https://github.com/tcoopman/image-webpack-loader): Optimize/Minify png, jpg, gif and svg images
- [**Shell Script Integration**](https://www.npmjs.com/package/webpack-shell-plugin): run shell scripts on build start, end and/or exit

#INSTALL

- run `git clone https://github.com/Donmclean/riko.git`
- cd into the cloned directory by running `cd riko`
- run `npm install`
- grab ~~coffee~~ a redbull

#USAGE

- run `npm run dev` to run source code in "development" mode


######- Production mode supports the following features
- lints and compiles js & sass sources to minified `dist/` directory
- hashes build sources to control caching. 
    - eg: `index.html?405kjdjsd7ed89a68ac` `styles.min.css?405eccffee7ed89a68ac` `bundle.js?405eccffee7ed89a68ac`
    

######- Other features
- run `npm run server` after a `npm run prod` to test out a "production" build. `localhost:8080` in browser

- run `npm test` to execute unit tests
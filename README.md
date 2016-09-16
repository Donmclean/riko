[![RIKO](./test-riko/riko-favicon.png)](https://github.com/Donmclean/riko)

Webpack Build System for React JS

[![Build Status](https://travis-ci.org/Donmclean/riko.svg?branch=master)](https://travis-ci.org/Donmclean/riko) [![dependencies Status](https://david-dm.org/donmclean/riko/status.svg)](https://david-dm.org/donmclean/riko) [![devDependencies Status](https://david-dm.org/donmclean/riko/dev-status.svg)](https://david-dm.org/donmclean/riko?type=dev) [![Coverage Status](https://coveralls.io/repos/github/Donmclean/riko/badge.svg?branch=master)](https://coveralls.io/github/Donmclean/riko?branch=master)


#FEATURES

- Supports compilation of [**js**](https://www.javascript.com/) & [**jsx**](https://facebook.github.io/react/docs/jsx-in-depth.html) source files
- Supports compilation of [**pug**](https://pugjs.org) template files to html
- Supports compilation of [**sass**](http://sass-lang.com/), [**less**](http://lesscss.org/), and [**css**](http://www.w3schools.com/css/) stylesheets
- Supports generation of [**Source mapping**](https://www.npmjs.com/package/source-map) for stylesheets and js sources
- Javascript (_js_,_jsx_) linting via [**eslint**](http://eslint.org/)
- Stylesheet (_sass_, _less_, _css_) linting via [**stylelint**](https://github.com/stylelint/stylelint)
- [**Autoprefixing**](https://github.com/postcss/autoprefixer) for stylesheets
- [**Browsersync**](https://www.browsersync.io/) functionality by default
- [**Jest**](https://facebook.github.io/jest/), [**Mocha**](https://mochajs.org/), [**Chai**](http://chaijs.com/) or any unit testing framework supported by [**Karma JS Test Runner**](https://karma-runner.github.io/1.0/index.html)
- [**Nightwatch JS Selenium Testing**](http://nightwatchjs.org/): run selenium tests in numerous browsers & environments.
Also supports browserstack for running multiple test suites
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

#INSTALL

- run `git clone https://github.com/Donmclean/riko.git`
- cd into the cloned directory by running `cd riko`
- run `npm install`
- grab ~~coffee~~ a redbull

#USAGE

- After installation you can run either of the following two options: 
    - `npm run setup` to setup the most basic content to jump start your application.
    - `npm run setup-demo` to setup demo content to get a better sense of how testing, asset loading etc works within the build system. 
 
> It's recommended that you run a `npm run setup-demo` first and get a good feel for working with the build system. 
> Then run a `npm run setup` when you're ready to start your application.
 
- After running one of the setup commands notice there is a new `src/` folder in the directory. 

######- Other features
- run `npm run server` after a `npm run prod` to test out a "production" build. `localhost:8080` in browser

- run `npm test` to execute unit tests
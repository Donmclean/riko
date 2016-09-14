[![RIKO](./test-riko/riko-favicon.png)](https://github.com/Donmclean/riko)

Webpack Build System for React JS

[![Build Status](https://travis-ci.org/Donmclean/riko.svg?branch=master)](https://travis-ci.org/Donmclean/riko) [![dependencies Status](https://david-dm.org/donmclean/riko/status.svg)](https://david-dm.org/donmclean/riko) [![devDependencies Status](https://david-dm.org/donmclean/riko/dev-status.svg)](https://david-dm.org/donmclean/riko?type=dev) [![Coverage Status](https://coveralls.io/repos/github/Donmclean/riko/badge.svg?branch=master)](https://coveralls.io/github/Donmclean/riko?branch=master)


#FEATURES

######- Development Mode: `npm run dev`

- Supports compilation of _js_ & _jsx_ source files
- Supports compilation of _sass_, _less_, and _css_ stylesheets.
- Source mapping for stylesheets and js sources
- Javascript (_js_,_jsx_) linting via [**eslint**](http://eslint.org/)
- Stylesheet (_sass_, _less_, _css_) linting via [**stylelint**](https://github.com/stylelint/stylelint)
- [**Hot Module Replacement**](https://webpack.github.io/docs/hot-module-replacement.html) for stylesheets(_sass,css,less_) and js(_js,jsx_) sources
- [**Browsersync**](https://www.browsersync.io/) functionality by default
- [**Jest**](https://facebook.github.io/jest/), [**Mocha**](https://mochajs.org/), or any unit testing framework supported by [**Karma JS Test Runner**](https://karma-runner.github.io/1.0/index.html)
- 

#CAVEATS

#INSTALL

- clone
- run `npm install`

#USAGE

- run `npm run dev` to run source code in "development" mode


######- Production mode supports the following features
- lints and compiles js & sass sources to minified `dist/` directory
- hashes build sources to control caching. 
    - eg: `index.html?405kjdjsd7ed89a68ac` `styles.min.css?405eccffee7ed89a68ac` `bundle.js?405eccffee7ed89a68ac`
    

######- Other features
- run `npm run server` after a `npm run prod` to test out a "production" build. `localhost:8080` in browser

- run `npm test` to execute unit tests
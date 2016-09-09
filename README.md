# RIKO
Webpack Build System for React JS

[![Build Status](https://travis-ci.org/Donmclean/riko.svg?branch=master)](https://travis-ci.org/Donmclean/riko) [![dependencies Status](https://david-dm.org/donmclean/riko/status.svg)](https://david-dm.org/donmclean/riko) [![Coverage Status](https://coveralls.io/repos/github/Donmclean/riko/badge.svg?branch=master)](https://coveralls.io/github/Donmclean/riko?branch=master)

#INSTALL

- clone
- run `npm install`

#USAGE

- run `npm run dev` to run source code in "development" mode

######- Development mode supports the following features
- hot module replacement from stylesheets and js sources
- sass & js linting
- [browsersync](https://www.browsersync.io/) functionality
- [Jest](https://facebook.github.io/jest/) Unit Testing

- run `npm run prod` to run source code in "production" mode

######- Production mode supports the following features
- lints and compiles js & sass sources to minified `dist/` directory
- hashes build sources to control caching. 
    - eg: `index.html?405kjdjsd7ed89a68ac` `styles.min.css?405eccffee7ed89a68ac` `bundle.js?405eccffee7ed89a68ac`
    

######- Other features
- run `npm run server` after a `npm run prod` to test out a "production" build. `localhost:8080` in browser

- run `npm test` to execute unit tests
import custom_config from './webpack/config';

const
    config      = custom_config || {},
    indexJSFile = require('./webpack/index')(config),
    _v          = config.vars;

process.env.NODE_ENV = process.env.NODE_ENV || "development";

config.devtool = null;

config.entry = [
  'webpack-hot-middleware/client',
  './src/js/app.js'
];

config.output = {
  path: __dirname,
  filename: 'bundle.js',
  publicPath: '/'
};

config.resolve = {
  extensions: ['', '.js'],
  alias: {
    request: 'browser-request'
  }
};

config.module = {

  loaders: [
    // Javascript
    {
      test: /\.js$/,
      loader: 'babel',
      include: _v.path.join(__dirname, 'src'),
      query: {
        "env": {
          "development": {
            "presets": ["react-hmre"],
            "plugins": [
              ["react-transform", {
                "transforms": [{
                  "transform": "react-transform-hmr",
                  "imports": ["react"],
                  "locals": ["module"]
                }]
              }]
            ]
          }
        },
      }
    },
    {
      test: /\.jsx?$/,
      loader: 'babel',
      include: _v.path.join(__dirname, 'src'),
      query: {
        "env": {
          "development": {
            "presets": ["react-hmre"],
            "plugins": [
              ["react-transform", {
                "transforms": [{
                  "transform": "react-transform-hmr",
                  "imports": ["react"],
                  "locals": ["module"]
                }]
              }]
            ]
          }
        },
      }
    },

      //TEMPLATE (PUG)
    {
      test: /\.pug$/,
      exclude: /(node_modules|bower_components)/,
      loader: "pug-loader"
    },

    // SASS
    {
      test: /\.scss$/,
      loaders: ["react-hot", "style", "css?sourceMap", "postcss", "sass?sourceMap"]
    },

    // CSS
    {
      test: /\.css$/,
      include: _v.path.join(__dirname, 'src'),
      loader: 'style-loader!css-loader?' + _v.qs.stringify({
        modules: true,
        importLoaders: 1,
        localIdentName: '[path][name]-[local]'
      })
    },

      //FILES
    {
      test: /\.(jpg|jpeg|png|gif|tif|svg|woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url'
    }

  ]
};

config.postcss = [  _v.postcssImport, _v.autoprefixer() ];

//*****************************************************************
//*****************************PLUGINS*****************************
//*****************************************************************

let plugins = [
  new _v.webpack.EnvironmentPlugin([
    "NODE_ENV"
  ]),
  new _v.ProgressBarPlugin({
    format: 'webpack [:bar] ' + _v.chalk.green.bold(':percent') + ' (:elapsed seconds)',
    clear: true
  }),
  new _v.HtmlWebpackPlugin(indexJSFile),
  new _v.StyleLintPlugin({
      configFile: '.stylelintrc.yaml',
      files: ['**/*.s?(a|c)ss','!node_modules/'],
      failOnError: false,
  })
];

console.log('_v.NODE_ENV: ', _v.NODE_ENV);

switch (_v.NODE_ENV) {
  case "production": {
    config.devtool  = null;

    plugins = plugins.concat([
      new _v.webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new _v.webpack.optimize.DedupePlugin(),
      new _v.webpack.optimize.OccurenceOrderPlugin(),
      new _v.webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false, compress: {warnings: false} })
    ]);
    break;
  }
  case "development": {
    // config.devtool  = "inline-sourcemap";
    config.devtool = '#eval-source-map';

    config.debug = true;

    plugins = plugins.concat([
      new _v.webpack.optimize.OccurenceOrderPlugin(),
      new _v.webpack.HotModuleReplacementPlugin(),
      new _v.webpack.NoErrorsPlugin(),
      new _v.BrowserSyncPlugin(
          {
            proxy: 'http://localhost:' + config.EXPRESS_PORT,
          },
          {
            reload: false //Allows hot module reloading to take care of this. (preserves state)
          })
    ]);
    break;
  }
  default: {
    break;
  }
}

config.plugins = plugins;

module.exports = config;
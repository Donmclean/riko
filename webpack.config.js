const
    custom_config = require('./webpack/config'),
    config        = custom_config || {},
    indexJSFile   = require('./webpack/index')(config),
    _v            = config.vars;

config.devtool = null;

config.entry = [
  // 'webpack-hot-middleware/client', //handled in NODE_ENV switch statement below
  './src/js/app.js',
];

config.output = {
  path: __dirname + "/app",
  filename: 'bundle.js',
  publicPath: '/'
};

config.resolve = {
  extensions: ['', '.js', '.jsx'],
  alias: {
    request: 'browser-request'
  }
};

config.module = {

  preLoaders: [
    {
      test: /\.js$/,
      loaders: [ 'eslint' ],
      exclude: /(node_modules|vendor|bower_components)/
    }
  ],
  loaders: [
    // Javascript
    {
      test: /\.js$/,
      include: _v.path.join(__dirname, 'src'),
      loader: 'babel',
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
        presets: ['es2015'],
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
      },
      presets: ['react', 'es2015', 'stage-0'],
      plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy','add-module-exports']
    },

      //TEMPLATE (PUG)
    {
      test: /\.pug$/,
      exclude: /(node_modules|bower_components)/,
      loader: "pug-loader"
    },

      //FILES
    {
      test: /\.(jpg|jpeg|png|gif|tif|svg|woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url'
    }

  ],
  postLoaders: [
      { //delays coverage til after tests are run, fixing transpiled source coverage error
        test: /\.js$/,
        exclude: /(tests|node_modules|bower_components)\//,
        loader: 'istanbul-instrumenter'
      }
  ]
};

config.postcss = [ _v.autoprefixer({ browsers: ['last 2 versions'] }) ];

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
  new _v.Visualizer({
    filename: './stats.html'
  })
];

console.log('_v.NODE_ENV: ', _v.NODE_ENV);

switch (_v.NODE_ENV) {
  case "production": {
    config.devtool  = null;

    config.entry = {
      riko: './src/js/app.js',
    };

    config.module.preLoaders = [
      {
        test: /\.js$/,
        loaders: [ 'babel', 'eslint' ],
        exclude: /(node_modules|vendor|bower_components)/
      }
    ];

    config.module.loaders.push({
          test: /\.scss$/,
          loader: _v.ExtractTextPlugin.extract(
              "style",
              "css!postcss!sass"),
        },
        // CSS
        {
          test: /\.css$/,
          include: _v.path.join(__dirname, 'src'),
          loader: _v.ExtractTextPlugin.extract("style", "css", "postcss")
        }
    );

    plugins = plugins.concat([
      new _v.webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new _v.webpack.optimize.DedupePlugin(),
      new _v.webpack.optimize.OccurenceOrderPlugin(),
      new _v.webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false, compress: {warnings: false} }),
      new _v.webpack.optimize.CommonsChunkPlugin(config.moduleName, config.js_main_name),
      new _v.ExtractTextPlugin("styles.min.css", {allChunks: true})
    ]);
    break;
  }
  case "development": {
    //update entry
    config.entry.unshift('webpack-hot-middleware/client');

    config.devtool = '#eval-source-map';

    // config.eslint = {
    //   failOnError: false
    // };

    config.debug = true;

    config.module.loaders.push(
        // SASS
        {
          test: /\.scss$/,
          loaders: [
            'style',
            'css-loader?sourceMap',
            "postcss",
            "sass?sourceMap",
          ],
        },

        // CSS
        {
          test: /\.css$/,
          include: _v.path.join(__dirname, 'src'),
          loaders: ["style", "css?sourceMap", "postcss"],

        });

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
          }),
      new _v.StyleLintPlugin({
        configFile: '.stylelintrc.yaml',
        files: ['**/*.s?(a|c)ss','!node_modules/'],
        failOnError: false,
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
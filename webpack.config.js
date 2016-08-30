const
    custom_config = require('./webpack/config'),
    config        = custom_config || {},
    indexJSFile   = require('./webpack/index')(config),
    _v            = config.vars;

config.devtool = null;

config.entry = [
    config.js_main_entry_path
];

config.output = {
  path: config.destDir,
  filename: config.js_main_file_name,
  publicPath: ''
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
      test: /\.jsx$|\.js$/,
      loaders: [ 'eslint' ],
      include: config.srcDir,
      exclude: /(node_modules|vendor|bower_components)/
    }
  ],
  loaders: [
    // Javascript
    {
      test: /\.jsx$|\.js$/,
      include: config.srcDir,
      loaders: ['react-hot','babel'],
    },
      //TEMPLATE (PUG)
    {
      test: /\.pug$/,
      exclude: /(node_modules|bower_components)/,
      loader: "pug"
    },
    //FONTS
    {
      test: /\.(woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: `file?name=${config.media_fonts_output_path}/[name].[ext]`
    },
    //IMAGES
    {
      test: /\.(jpg|jpeg|png|gif|tif|svg|bmp)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: `file?name=${config.media_images_output_path}/[name].[ext]`
    },
    //VIDEOS
    {
      test: /\.(mpeg|mpg|MPG|mp4|MP4|avi|AVI|wmv|WMV|flv|FLV)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: `file?name=${config.media_video_output_path}/[name].[ext]`
    },
    //AUDIO
    {
      test: /\.(wav|WAV|mp3|MP3|aiff|AIFF|flac|FLAC|mp4a|MP4A|wma|WMA|aac|AAC|au|AU|rm|RAM)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: `file?name=${config.media_audio_output_path}/[name].[ext]`
    },
    //FILES
    {
      test: /\.(doc|DOC|docx|DOCX|pdf|PDF|xls|xlsx|csv|txt)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: `file?name=${config.media_files_output_path}/[name].[ext]`
    }

  ],
  // postLoaders: [
  //     { //delays coverage til after tests are run, fixing transpiled source coverage error
  //       test: /\.jsx$|\.js$/,
  //       exclude: /(tests|node_modules|bower_components)\//,
  //       loader: 'istanbul-instrumenter'
  //     }
  // ]
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
  new _v.Visualizer({filename: config.template_stats_file_name})
];

console.log('_v.NODE_ENV: ', _v.NODE_ENV);

switch (_v.NODE_ENV) {

  case "production": {

    config.devtool  = null;

    config.eslint = {
      failOnError: true,
      failOnWarning: false
    };

    config.bail = true;

    config.entry[config.moduleName] = config.js_main_entry_path;

    config.module.loaders.push({
          test: /\.scss$/,
          loader: _v.ExtractTextPlugin.extract("style", "css!postcss!sass"),
        },
        // CSS
        {
          test: /\.css$/,
          include: config.srcDir,
          loader: _v.ExtractTextPlugin.extract("style", "css!postcss")
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
      new _v.webpack.optimize.CommonsChunkPlugin(config.moduleName, config.js_output_path+'/'+config.js_main_file_name),
      new _v.ExtractTextPlugin(config.styles_output_path+'/'+config.styles_main_file_name, {allChunks: true})
    ]);
    break;
  }
  case "development": {

    config.devtool = '#inline-source-map';

    config.debug = true;

    config.eslint = {
      failOnError: false,
      failOnWarning: false
    };

    config.debug = true;

    config.module.loaders.push(
        // SASS
        {
          test: /\.scss$/,
          loaders: ['style', 'css-loader?sourceMap', "postcss", "sass?sourceMap"],
        },

        // CSS
        {
          test: /\.css$/,
          include: config.srcDir,
          loaders: ["style", "css?sourceMap!postcss"],
        }
    );

    plugins = plugins.concat([
      new _v.webpack.optimize.OccurenceOrderPlugin(),
      new _v.webpack.HotModuleReplacementPlugin(),
      new _v.BrowserSyncPlugin(
          {
            proxy: 'http://localhost:' + config.EXPRESS_PORT,
          },
          {
            reload: false //Allows hot module reloading to take care of this. (preserves state)
          }),
      new _v.StyleLintPlugin({
        configFile: config.stylelintConfig,
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
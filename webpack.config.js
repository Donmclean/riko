"use strict";
const
    custom_config = require('./webpack/config'),
    config        = custom_config || {},
    indexJSFile   = require('./webpack/index')(config),
    _v            = config.vars,
    funcs         = require('./webpack/functions')(_v);

config.entry = [
    config.js_main_entry_path
];

config.output = {
  path: config.destDir,
  filename: config.js_main_file_name,
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
      test: /\.jsx$|\.js$/,
      loaders: [ 'eslint' ],
      include: config.srcDir,
      exclude: /(node_modules|vendor|bower_components)/
    }
  ],
  loaders: [
    // JAVASCRIPT
    {
      test: /\.jsx$|\.js$/,
      include: config.srcDir,
      loaders: _v.NODE_ENV === 'test' ? ['babel'] : ['react-hot','babel']
    },
      //TEMPLATES (PUG)
    {
      test: /\.pug$/,
      exclude: /(node_modules|bower_components)/,
      loader: "pug"
    },
      //TEMPLATES (OTHER)
    {
      test: /\.(ejs|mustache|hbs|handlebars)$/,
      loader: "template-html-loader"+ !_v._.isEmpty(config.template_engine) ? '?engine='+config.template_engine : ''
    },
    //VIDEOS
    {
      test: /\.(mpeg|mpg|mp4|avi|wmv|flv)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
      loader: `file?name=${config.media_video_output_path}/[name].[ext]`
    },
    //AUDIO
    {
      test: /\.(wav|WAV|mp3|aiff|flac|mp4a|wma|aac|au|rm)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
      loader: `file?name=${config.media_audio_output_path}/[name].[ext]`
    },
    //FILES
    {
      test: /\.(doc|docx|pdf|xls|xlsx|csv|txt)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
      loader: `file?name=${config.media_files_output_path}/[name].[ext]`
    }
  ]
};

config.postcss = [ _v.autoprefixer(config.autoprefixerOptions) ];

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
    filename: funcs.insertGitVersionIntoFilename(config.template_stats_file_name, _v.GIT_VERSION)
  }),
  new _v.StyleLintPlugin({
    configFile: config.stylelintConfig,
    files: [
        'src/**/*.s?(a|c)ss','src/**/*.less','src/**/*.css','!node_modules/'
    ],
    failOnError: config.failOnProdBuildStyleError
  }),
  new _v.WebpackNotifierPlugin({contentImage: config.baseDir+'/test-riko/riko-favicon.png'}),
];

console.log('_v.NODE_ENV: ', _v.NODE_ENV);

switch (_v.NODE_ENV) {

  case "production": {

    config.devtool = config.sourcemapProd ? 'inline-source-map' : null;

    config.eslint = {
      failOnError: config.failOnProdBuildJsError,
      failOnWarning: false,
      configFile: config.eslintConfig
    };

    config.bail = config.failOnProdBuildJsError;

    config.module.loaders.push(
        // SASS
        {
          test: /\.scss$/,
          loader: _v.ExtractTextPlugin.extract("style", `css${config.sourcemapProd ? '?sourceMap' : ''}!postcss!sass${config.sourcemapProd ? '?sourceMap' : ''}`)
        },
        // LESS
        {
          test: /\.less$/,
          loader: _v.ExtractTextPlugin.extract("style", `css${config.sourcemapProd ? '?sourceMap' : ''}!postcss!less${config.sourcemapProd ? '?sourceMap' : ''}`)
        },
        // CSS
        {
          test: /\.css$/,
          include: config.srcDir,
          loader: _v.ExtractTextPlugin.extract("style", `css${config.sourcemapProd ? '?sourceMap' : ''}!postcss`)
        },
        //FONTS
        {
          test: /\.(woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: `file?name=${config.media_fonts_output_path}/[name].[ext]`
        },
        //IMAGES
        {
          test: /\.(jpe?g|png|gif|tif|svg|bmp)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          loader: `file?name=${config.media_images_output_path}/[name].[ext]`
        }
    );

    plugins = plugins.concat([
      new _v.webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(_v.NODE_ENV)
        }
      }),
      new _v.webpack.optimize.DedupePlugin(),
      new _v.webpack.optimize.OccurenceOrderPlugin(),
      new _v.webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: config.sourcemapProd, compress: {warnings: false} }),
      new _v.webpack.optimize.CommonsChunkPlugin('main', config.js_output_path+'/'+config.js_main_file_name),
      new _v.webpack.ProvidePlugin(config.externalModules),
      new _v.ExtractTextPlugin(config.styles_main_file_name, {allChunks: true}),

      //Image optimization options | imagemin-webpack-plugin
      //https://github.com/Klathmon/imagemin-webpack-plugin
      new _v.ImageminPlugin(config.imageminConfig),
      new _v.WebpackShellPlugin({
        onBuildStart: config.onBuildStartShellCommands,
        onBuildEnd: config.onBuildEndShellCommands,
        onBuildExit: config.onBuildExitShellCommands,
      }),
      new _v.CleanWebpackPlugin([config.destDir], {root: config.baseDir, verbose: true, dry: false})
    ]);
    break;
  }

  case "test":
  case "development": {

    config.debug = true;

    config.devtool = config.sourcemapDev ? 'inline-source-map' : null;

    config.eslint = {
      failOnError: false,
      failOnWarning: false,
      emitError: true,
      configFile: config.eslintConfig
    };

    config.module.loaders.push(
        // SASS
        {
          test: /\.scss$/,
          loaders: [
            'style',
            `css${config.sourcemapDev ? '?sourceMap' : ''}`,
            'postcss',
            `sass${config.sourcemapDev ? '?sourceMap' : ''}`,
          ]
        },
        // LESS
        {
          test: /\.less$/,
          loaders: [
            'style',
            `css${config.sourcemapDev ? '?sourceMap' : ''}`,
            'postcss',
            `less${config.sourcemapDev ? '?sourceMap' : ''}`
          ]
        },
        // CSS
        {
          test: /\.css$/,
          include: config.srcDir,
          loaders: [
            'style',
            `css${config.sourcemapDev ? '?sourceMap' : ''}`,
            'postcss'
          ]
        },
        //FONTS
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url?mimetype=application/font-woff"
        },
        {
          test: /\.(eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file'
        },
        //IMAGES
        {
          test: /\.(jpe?g|png|gif|tif|svg|bmp)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          loader: 'url'
        }
    );

    plugins = plugins.concat([
      new _v.webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(_v.NODE_ENV)
        }
      }),
      new _v.webpack.optimize.OccurenceOrderPlugin(),
      new _v.webpack.HotModuleReplacementPlugin(),
      new _v.BrowserSyncPlugin(
          {
            proxy: 'http://localhost:' + config.EXPRESS_PORT,
          },
          {
            reload: false //Allows hot module reloading to take care of this. (preserves state)
          }),
      new _v.webpack.ProvidePlugin(config.externalModules)
    ]);

    //handle remote debugging
    if(config.enableRemoteDebugging && _v.NODE_ENV === "development") {
      _v.exec('npm run vorlon', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error > enableRemoteDebugging: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
      config.js_external_scripts.push({src: `http://${_v.ipAddress}:1337/vorlon.js`});
    }

    break;
  }
  default: {
    break;
  }
}

config.plugins = plugins;

module.exports = config;
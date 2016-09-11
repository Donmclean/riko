const config = {};

//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************

//Root Directory
const baseDir                  = process.cwd(); //IMPORTANT! DO NOT OVERRIDE!

//**********************************************************************
//******************************CUSTOM**********************************
//**********************************************************************
//IMPORTANT! All paths/directories should be relative to 'baseDir' unless specified otherwise.
// eg: baseDir+'/path'

config.moduleName               = 'riko';
config.destDir                  = baseDir+"/app";

config.EXPRESS_PORT             = 3000;
config.EXPRESS_ROOT             = config.destDir;

config.eslintConfig             = baseDir+'/src/__linters/.eslintrc';
config.stylelintConfig          = baseDir+'/src/__linters/.stylelintrc.yaml';
config.karmaConfig              = baseDir+'/karma.conf.js';
config.nightWatchConfig         = baseDir+'/nightwatch.json';
config.packageJson              = baseDir+'/package.json';

//**********************************************************************
//********************************JS************************************
//**********************************************************************

config.js_main_file_name        = config.moduleName+'.js';
config.js_main_entry_path       = baseDir+'/src/js/'+config.js_main_file_name;
config.js_output_path           = 'assets/js';

//**********************************************************************
//*******************************STYLES*********************************
//**********************************************************************
config.styles_main_file_name    = 'styles.min.css';

//**********************************************************************
//******************************TEMPLATE********************************
//**********************************************************************
config.template_main_file_name  = 'index.html';
config.template_stats_file_name = '';
config.template_src_path        = baseDir+'/src/templates/index.pug';

//if you're using a custom template engine 'OTHER THAN' pug or html
//add as string below.
//https://www.npmjs.com/package/template-html-loader
//https://github.com/tj/consolidate.js
config.template_engine          = ''; //eg: hbs, handlebars, ejs, mustache

//**********************************************************************
//********************************MEDIA*********************************
//**********************************************************************

// IMPORTANT!!! (THESE ARE ALREADY RELATIVE TO OUTPUT OR DESTINATION)
// ALSO DO NOT ADD TRAILING SLASH '/' eg: assets/audio/

config.media_audio_output_path  = 'assets/audio';
config.media_files_output_path  = 'assets/files'; //pdfs, docs, etc
config.media_fonts_output_path  = 'assets/fonts';
config.media_images_output_path = 'assets/images';
config.media_video_output_path  = 'assets/video';

// IMPORTANT!!! Use absolute path here.
config.media_favicon_path       = baseDir+'/src/media/images/riko-favicon.png';

//Image optimization options
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

//**********************************************************************
//*******************************VENDOR*********************************
//**********************************************************************

// add vendor dependencies here
config.externalModules = {
    //eg: $ : 'jquery'
};

//**********************************************************************
//*******************************TESTS**********************************
//**********************************************************************

// See karma.conf.js file

//**********************************************************************
//*******************************EXTRAS*********************************
//**********************************************************************

config.autoprefixerOptions     = { browsers: ['> 0%'] }; //prefix all

config.hotReloadingOptions     = {
    overlay: true,
    reload: true,
    noInfo: false,
    quiet: false
};

// IMPORTANT! must be and array
config.onBuildStartShellCommands = [];
config.onBuildEndShellCommands = [];
config.onBuildExitShellCommands = [];

config.failOnProdBuildError = true;

module.exports = config;
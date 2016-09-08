const config = {};

//**********************************************************************
//*******************************CORE***********************************
//**********************************************************************

config.vars                     = require('./variables')();

config.moduleName               = 'riko';
config.nodePath                 = process.env.NODE_PATH;
config.sitePrefix               = '';
config.baseDir                  = process.cwd();
config.destDir                  = config.baseDir+"/app";
config.srcDir                   = config.baseDir+"/src";

config.EXPRESS_PORT             = 3000;
config.EXPRESS_ROOT             = config.destDir;

config.jscsConfig               = config.baseDir+'/.jscsrc';
config.eslintConfig             = config.baseDir+'/.eslintrc';
config.stylelintConfig          = config.baseDir+'/.stylelintrc.yaml';
config.karmaConfig              = config.baseDir+'/karma.conf.js';
config.nightWatchConfig         = config.baseDir+'/nightwatch.json';


//**********************************************************************
//********************************JS************************************
//**********************************************************************

config.js_main_file_name        = config.moduleName+'.js';
config.js_main_entry_path       = config.baseDir+'/src/js/'+config.js_main_file_name;
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
config.template_src_path        = config.baseDir+'/src/templates/index.pug';

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

module.exports = config;
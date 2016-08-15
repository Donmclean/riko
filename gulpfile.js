"use strict";

// Load config
const
    config          = require('./gulp/gulp.config')(),

// Load functions
    funcs           = require(config.baseDir +'/gulp/functions')(config.vars.gulp, config.vars.$, config);

// Define/Collect all tasks
config.vars._.forEach(config.taskList, (file) => {

    config.vars.logi.mixed([{value: "Collecting task:"}, {color: 'yellow', value: config.vars.path.basename(file, '.js')}]);

    if(file !== '.DS_Store') {
        require(config.taskDir + file)(config.vars.gulp, config.vars.$, config, funcs);
    }
});

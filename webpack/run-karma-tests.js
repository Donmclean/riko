const
    config = require('./config');
    babelRegister = require("babel-register")();

const startUnitTests = () => {
    let called = false,
        excludes = ['!node_modules'];

    let server = new config.vars.karmaServer(config.vars._.assign(
        {configFile: config.karmaConfigFile},
        {singleRun: true},
        {autoWatch: false},
        {exclude: excludes}
    ), results => {
        if(!called) {
            called = true;

            if(results === 0) {
                console.log("Karma Unit Tests Passed");

            } else {
                console.error("Karma Unit Tests Failed");
                config.vars.exec(process.exit(results));
            }
        }
    });

    server.start();
    server.on('browser_error', (err) => {
        console.error('ERROR:', err);

    });
};

startUnitTests();
/**
 * Module dependencies.
 */

const
    cwd             = process.cwd(),
    config          = require(cwd + '/gulp/gulp.config')(),
    express         = require('express'),
    app             = require('express')(),
    morgan          = require('morgan'),
    EXPRESS_PORT    = config.EXPRESS_PORT || 3000,
    EXPRESS_ROOT    = config.EXPRESS_ROOT_PROD || config.destDir || cwd + '/app';

/**
 * Get port from environment and store in Express.
 */

app.use(morgan('dev'));
app.use(express.static(EXPRESS_ROOT));


/**
 * Create HTTP server & Listen on provided port, on all network interfaces.
 */

app.listen(EXPRESS_PORT);


/**
 * Event listener for HTTP server "error" event.
 */

app.use(logErrors);

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
const
    config          = require('../webpack/config');
    _v              = config.vars;


_v.app.use(_v.morgan('dev'));
_v.app.use(_v.express.static(config.EXPRESS_ROOT));

_v.app.listen(config.EXPRESS_PORT);

const logErrors = (err, req, res, next) => {
    console.error(err.stack);
    next(err);
};

_v.app.use(logErrors);
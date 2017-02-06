const _v = require('./variables')();

module.exports = () => {
    const funcs = {};

    funcs.isValidOption = (options, targetOption) => {
        return _v._.find(options, (option) => option === targetOption);
    };

    return funcs;
};
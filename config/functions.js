const _v = require('./variables')();

module.exports = () => {
    const funcs = {};

    funcs.validateOptions = (options, chosenOption) => {
        return _v._.find(options, (option) => option === chosenOption);
    };

    return funcs;
};
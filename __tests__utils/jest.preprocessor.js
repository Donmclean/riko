var ReactTools = require('react-tools');
module.exports = {
    process: function(src) {
        return ReactTools.transform(src, { harmony: true, es6module: true, nonStrictEs6module: true });
    }
};
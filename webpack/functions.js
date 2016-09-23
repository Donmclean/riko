"use strict";
module.exports = (_v) => {
    const functions = {};

    functions.insertGitSHAIntoFilename = (filename, GitVersion) => {
        if(filename && !_v._.isEmpty(filename)) {
            let arr = filename.split('.');
            arr[0] = arr[0].concat('-');
            arr[1] = '.'.concat(arr[1]);

            arr.splice(1, 0, GitVersion);
            return arr.join('');
        } else {
            return GitVersion + '.html'
        }


    };

    return functions;

};
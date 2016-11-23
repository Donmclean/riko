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

    functions.removeDir = (dir) => {
        const deferred = _v.Q.defer();

        _v.qfs.isDirectory(dir).then((exists) => {
            if(exists) {
                try {
                    console.log(`Cleaning ${dir} directory: `);
                    _v.qfs.removeTree(dir)
                        .then(() => {
                            console.log(`${dir} directory removed...`);
                            deferred.resolve();
                        })
                        .catch((err) => {
                            console.log(`ERROR removing ${dir}`, err);
                            deferred.reject(err);
                        });
                } catch (err) {
                    console.log(`ERROR removing ${dir}`, err);
                    deferred.reject(err);
                }
            } else {
                console.log(`${dir} directory does not exist...`);
                deferred.resolve();
            }
        });

        return deferred.promise;
    };

    return functions;

};
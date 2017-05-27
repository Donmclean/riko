const
    packageJson = require('../package.json'),
    _v          = require('./variables')(),
    readMePath  = _v.path.resolve(__dirname, `../README.md`);

const deferred = _v.Q.defer();

_v.qfs.read(readMePath)
    .then((readMe) => {
        const urlStringStart = 'https://img.shields.io/badge/npm-v';
        const urlStringEnd = '-blue.svg';

        const npmBadgeVersionUrl = readMe.substring(readMe.indexOf(urlStringStart), (readMe.indexOf(urlStringEnd) + urlStringEnd.length));

        if(npmBadgeVersionUrl) {
            return _v.qfs.write(readMePath, readMe.replace(npmBadgeVersionUrl, urlStringStart + packageJson.version + urlStringEnd));
        } else {
            throw new Error('npmBadgeVersionUrl is invalid');
        }
    })
    .catch((err) => {
        console.error(`ERROR > ${__filename}`, err);
        throw new Error(err);
    });

return deferred.promise;

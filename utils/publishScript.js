const
    packageJson = require('../package.json'),
    _v          = require('./variables')(),
    versionType = process.argv[2],
    shell = require('./shellRunner');
    readMePath  = _v.path.resolve(__dirname, `../README.md`);

console.log('versionType: ', versionType);
console.log('shell: ', shell);

const handleVersionUpdate = (versionUpdateType) => {
    const versionUpdateTypes = ['patch', 'minor', 'major'];
    const isValidVersionUpdateType = _v._.includes(versionUpdateTypes, versionUpdateType);

    if(isValidVersionUpdateType) {
        return _v.spawn('npm', ['version', versionUpdateType], {stdio: 'inherit'});
    } else {
        throw new Error('invalid versionUpdateType');
    }
};

let spawn = handleVersionUpdate(versionType);

spawn
    .on('close', () => {
        return _v.qfs.read(readMePath)
            .then((readMe) => {
                const urlStringStart = 'https://img.shields.io/badge/npm-v';
                const urlStringEnd = '-blue.svg';

                const npmBadgeVersionUrl = readMe.substring(readMe.indexOf(urlStringStart), (readMe.indexOf(urlStringEnd) + urlStringEnd.length));

                if(npmBadgeVersionUrl) {
                    return _v.qfs.write(readMePath, readMe.replace(npmBadgeVersionUrl, urlStringStart + packageJson.version + urlStringEnd));
                }

                return null;
            })
            .then(() => {
                shell.series([
                    'echo "hahahahhaha"',
                    'echo "ccccc"',
                    'echo ">>>>>>>>"',
                ], (err) => {
                    if (err) {
                        console.error(`ERROR > ${__filename}`, err);
                        throw new Error(err);
                    }

                   console.log('done!!!!!');
                });


                // spawn = spawn
                //     .on('close', () => {
                //         return _v.spawn('echo', ['hahhahahahaha'], {stdio: 'inherit'});
                //     })
                //     .on('error', (err) => {
                //         console.error(`ERROR > ${__filename}`, err);
                //         throw new Error(err);
                //     });
                //
                // spawn = spawn
                //     .on('close', () => {
                //         return _v.spawn('echo', ['vvvvvvvvvvv'], {stdio: 'inherit'});
                //     })
                //     .on('error', (err) => {
                //         console.error(`ERROR > ${__filename}`, err);
                //         throw new Error(err);
                //     });

                // spawn = spawn
                //     .on('close', () => {
                //         return _v.spawn('npm', ['publish'], {stdio: 'inherit'});
                //     })
                //     .on('error', (err) => {
                //         console.error(`ERROR > ${__filename}`, err);
                //         throw new Error(err);
                //     });
                //
                // spawn = spawn
                //     .on('close', () => {
                //         return _v.spawn('git', ['push', '--follow-tags'], {stdio: 'inherit'});
                //     })
                //     .on('error', (err) => {
                //         console.error(`ERROR > ${__filename}`, err);
                //         throw new Error(err);
                //     });
            })
            .catch((err) => {
                console.error(`ERROR > ${__filename}`, err);
                throw new Error(err);
            });
    })
    .on('error', (err) => {
        console.error(`ERROR > ${__filename}`, err);
        throw new Error(err);
    });

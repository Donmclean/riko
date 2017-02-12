const _v = require('./variables');

module.exports = () => {
    const funcs = {};

    funcs.isValidOption = (options, targetOption) => _v._.includes(options, targetOption);

    funcs.throwOptionsError = (options) => {
        throw new Error('Invalid choice. Choices: ' + options.join(', '));
    };

    funcs.genericLog = (str, color) => {
        const { $ } = _v;
        $.util.log($.util.colors[color || 'yellow'](str));
    };

    funcs.folderAlreadyPresent = (files, folderName) => _v._.includes(files, folderName);

    funcs.sanitizeProjectName = (projectName) => projectName.toString().replace(/[ ]*,[ ]*|[ ]+/g, ' ');

    funcs.executeSetup = (actionType, projectType, projectName) => {
        const { $, qfs, cwd, baseDir } = _v;

        qfs.list(cwd)
            .then(files => {
                if(funcs.folderAlreadyPresent(files, projectName)) {
                    funcs.genericLog(`${$.util.colors.blue(projectName)} folder must not exist during setup. ${$.util.colors.red('terminating...')}`);
                    throw new Error(`${projectName} folder must not exist during setup.`);
                } else {
                    funcs.genericLog(`creating ${$.util.colors.blue(projectName)} folder and sub directories`);

                    qfs.copyTree(`${baseDir}/bin/_${actionType}/${projectType}`, `${cwd}/${projectName}`).then(() => {
                        funcs.genericLog(`${$.util.colors.blue(projectName)} folder created ${$.util.colors.green('successfully')}`);
                    });
                }
            })
            .catch((err) => {
                funcs.genericLog(err, 'red');
            });
    };

    return funcs;
};
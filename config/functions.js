const _v = require('./variables');

module.exports = () => {
    const funcs = {};

    funcs.isValidOption = (options, targetOption) => _v._.includes(options, targetOption);

    funcs.throwOptionsError = (options) => {
        throw new Error('Invalid choice. Choices: ' + options.join(', '));
    };

    funcs.folderAlreadyPresent = (files, folderName) => _v._.includes(files, folderName);

    funcs.sanitizeProjectName = (projectName) => projectName.toString().replace(/[ ]*,[ ]*|[ ]+/g, ' ');

    funcs.executeSetup = (actionType, projectType, projectName) => {
        const { $, qfs, cwd, baseDir } = _v;

        qfs.list(cwd)
            .then(files => {
                if(funcs.folderAlreadyPresent(files, projectName)) {
                    $.util.log($.util.colors.yellow(`${$.util.colors.blue(projectName)} folder must not exist during setup. ${$.util.colors.red('terminating...')}`));
                    throw new Error(`${projectName} folder must not exist during setup.`);
                } else {
                    $.util.log($.util.colors.yellow(`creating ${$.util.colors.blue(projectName)} folder and sub directories`));

                    qfs.copyTree(`${baseDir}/bin/_${actionType}/${projectType}`, `${cwd}/${projectName}`).then(() => {
                        $.util.log($.util.colors.yellow(`${$.util.colors.blue(projectName)} folder created ${$.util.colors.green('successfully')}`));
                    });
                }
            });
    };

    return funcs;
};
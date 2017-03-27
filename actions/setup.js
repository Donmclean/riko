const
    _v      = require('../config/variables')(),
    funcs   = require('../config/functions')();

module.exports = {
    executeSetup: (actionType, projectType, projectName) => {
        const { $, qfs, cwd, baseDir } = _v;

        qfs.list(cwd)
            .then(files => {
                if(funcs.folderAlreadyPresent(files, projectName)) {
                    funcs.genericLog(`${$.util.colors.blue(projectName)} folder must not exist during setup. ${$.util.colors.red('terminating...')}`);
                    throw new Error(`${projectName} folder must not exist during setup.`);
                } else {
                    funcs.genericLog(`creating ${$.util.colors.blue(projectName)} folder and sub directories`);

                    if(projectType === 'electron') {
                        qfs.copyTree(`${baseDir}/bin/_${actionType}/web`, `${cwd}/${projectName}`)
                            .then(() => qfs.copyTree(`${baseDir}/bin/_${actionType}/${projectType}`, `${cwd}/${projectName}/src`))
                            .then(() => funcs.genericLog(`${$.util.colors.blue(projectName)} folder created ${$.util.colors.green('successfully')}`))
                            .catch((err) => funcs.genericLog(err, 'red'));
                    } else {
                        qfs.copyTree(`${baseDir}/bin/_${actionType}/${projectType}`, `${cwd}/${projectName}`)
                            .then(() => funcs.genericLog(`${$.util.colors.blue(projectName)} folder created ${$.util.colors.green('successfully')}`))
                            .catch((err) => funcs.genericLog(err, 'red'));
                    }
                }
            })
            .catch((err) => funcs.genericLog(err, 'red'));
    }
};
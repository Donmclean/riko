const
    _v      = require('../config/variables')(),
    funcs   = require('../config/functions')();

module.exports = (actionType, projectType, projectName) => {
    const { $, qfs, cwd, baseDir } = _v;
    const logSuccess = () => funcs.genericLog(`${$.util.colors.blue(projectName)} was setup ${$.util.colors.green('successfully')}`);

    return qfs.list(cwd)
        .then(files => {
            if(funcs.folderAlreadyPresent(files, projectName)) {
                funcs.genericLog(`${$.util.colors.blue(projectName)} folder must not exist during setup. ${$.util.colors.red('terminating...')}`);
                throw new Error(`${projectName} folder must not exist during setup.`);
            } else {
                switch (projectType) {
                    case 'electron': {
                        qfs.copyTree(`${baseDir}/bin/_${actionType}/web`, `${cwd}/${projectName}`)
                            .then(() => qfs.copyTree(`${baseDir}/bin/_${actionType}/${projectType}`, `${cwd}/${projectName}/src`))
                            .then(() => logSuccess())
                            .catch((err) => funcs.genericLog(err, 'red'));
                        break;
                    }
                    case 'node-server':
                    case 'web': {
                        qfs.copyTree(`${baseDir}/bin/_${actionType}/${projectType}`, `${cwd}/${projectName}`)
                            .then(() => logSuccess())
                            .catch((err) => funcs.genericLog(err, 'red'));
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        })
        .catch((err) => funcs.genericLog(err, 'red'));
};
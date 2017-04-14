const
    _v      = require('../utils/variables')(),
    funcs   = require('../utils/functions')();

module.exports = (actionType, projectType, projectName) => {
    const { $, qfs, cwd, baseDir, packageJson } = _v;
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
                            .then(() => qfs.read(`${cwd}/${projectName}/package.json`))
                            .then((customPackageJson) => {
                                const packageJsonObj = JSON.parse(customPackageJson);
                                packageJsonObj.devDependencies = Object.assign(
                                    {},
                                    packageJsonObj.devDependencies,
                                    {electron: packageJson.dependencies.electron}
                                );
                                packageJsonObj.devDependencies = funcs.sortObjByOwnKeys(packageJsonObj.devDependencies);
                                return packageJsonObj;
                            })
                            .then((packageJsonObj) => qfs.write(`${cwd}/${projectName}/package.json`, JSON.stringify(packageJsonObj, null, "\t")))
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
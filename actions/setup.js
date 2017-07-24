const
    _v      = require('../utils/variables')(),
    funcs   = require('../utils/functions')();

module.exports = (actionType, projectType, projectName) => {
    const { $, qfs, cwd, baseDir, packageJson, spawnSync } = _v;
    const logSuccess = () => funcs.genericLog(`${$.util.colors.blue(projectName)} was setup ${$.util.colors.green('successfully')}`);

    return qfs.list(cwd)
        .then(files => {
            if(funcs.folderAlreadyPresent(files, projectName)) {
                funcs.genericLog(`${$.util.colors.blue(projectName)} folder must not exist during setup. ${$.util.colors.red('terminating...')}`);
                throw new Error(`${projectName} folder must not exist during setup.`);
            } else {
                switch (projectType) {
                    case 'electron': {
                        qfs.copyTree(`${baseDir}/bin/_${actionType}/react`, `${cwd}/${projectName}`)
                            .then(() => qfs.copyTree(`${baseDir}/bin/_${actionType}/${projectType}`, `${cwd}/${projectName}/src`))
                            .then(() => qfs.read(`${cwd}/${projectName}/package.json`))
                            .then((customPackageJson) => {
                                //adds electron as devDependencies to package.json
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
                    case 'react': {
                        qfs.copyTree(`${baseDir}/bin/_${actionType}/${projectType}`, `${cwd}/${projectName}`)
                            .then(() => logSuccess())
                            .catch((err) => funcs.genericLog(err, 'red'));
                        break;
                    }
                    case 'react-native': {
                        //run react native shell script
                        spawnSync('sh', [`${baseDir}/bin/_${actionType}/${projectType}/react-native-install.sh`, projectName], {stdio: 'inherit'});

                        //copy rikoconfig.js file
                        qfs.makeTree(`${cwd}/${projectName}/src`)
                            .then(() => qfs.copy(`${baseDir}/bin/_${actionType}/${projectType}/rikoconfig.js`, `${cwd}/${projectName}/src/rikoconfig.js`))
                            .then(() => funcs.genericLog(`${$.util.colors.blue(`${projectName}`)} folder created ${$.util.colors.green('successfully')}`))
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
const
    _v      = require('../utils/variables')(),
    funcs   = require('../utils/functions')();

module.exports = (finalPath, actionType, fileType, fileName) => {
    const { fs, qfs, cwd, Q } = _v;
    const fullFilePath = `${finalPath}/${fileType}`;

    return qfs.isDirectory(fullFilePath).then((isDirectory) => {
        if(isDirectory) {
            return qfs.makeDirectory(`${cwd}/${fileName}`)
                .then(() => qfs.listTree(fullFilePath))
                .then((files) => {
                    const deferred = Q.defer();
                    const subDirFiles = files.slice(1, files.length);
                    const dirs = subDirFiles.filter((file) => fs.statSync(file).isDirectory());

                    Q.all(dirs.map((dir) => {
                        const relativeContentDir = dir.split(fullFilePath)[1];
                        const editedRelativeContentDir = funcs.regexReplaceCustomBoilerplateString(relativeContentDir, fileName);
                        return qfs.makeTree(`${cwd}/${fileName + editedRelativeContentDir}`);
                    }))
                    .then(() => deferred.resolve(files))
                    .catch((err) => {
                        funcs.genericLog(`Error making Directories: >: \n ${err}`, 'red');
                        deferred.reject(files);
                    });

                    return deferred.promise;
                })
                .then((files) => {
                    const subDirFiles = files.filter((file) => !fs.statSync(file).isDirectory());
                    return Q.all(subDirFiles.map((file) => {
                        const relativeContentDir = file.split(fullFilePath)[1];
                        return funcs.readReplaceAndWriteFilesToNewDirAsync(fileName, file, `${cwd}/${fileName + relativeContentDir}`);
                    }));
                }).catch((err) => {
                    funcs.genericLog(`err: \n ${err}`, 'red');
                });
        } else {
            return qfs.read(fullFilePath)
                .then((content) => {
                    const editedContent = funcs.regexReplaceCustomBoilerplateString(content, fileName);
                    return qfs.write(`${cwd}/${fileName}`, editedContent);
                })
                .then(() => {
                    funcs.genericLog(`${fileName} created successfully`);
                })
                .catch((err) => {
                    funcs.genericLog(`err: \n ${err}`, 'red');
                });
        }
    });
};
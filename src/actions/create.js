import { regexReplaceCustomBoilerplateString, readReplaceAndWriteFilesToNewDirAsync, genericLog } from '../utils/functions';
import { cwd } from '../utils/variables';
import Q from 'q';
import qfs from 'q-io/fs';
import fs from 'fs';

export default (finalPath, actionType, fileType, fileName) => {
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
                        const editedRelativeContentDir = regexReplaceCustomBoilerplateString(relativeContentDir, fileName);
                        return qfs.makeTree(`${cwd}/${fileName + editedRelativeContentDir}`);
                    }))
                    .then(() => deferred.resolve(files))
                    .catch((err) => {
                        genericLog(`Error making Directories: >: \n ${err}`, 'red');
                        deferred.reject(files);
                    });

                    return deferred.promise;
                })
                .then((files) => {
                    const subDirFiles = files.filter((file) => !fs.statSync(file).isDirectory());
                    return Q.all(subDirFiles.map((file) => {
                        const relativeContentDir = file.split(fullFilePath)[1];
                        return readReplaceAndWriteFilesToNewDirAsync(fileName, file, `${cwd}/${fileName + relativeContentDir}`);
                    }));
                }).catch((err) => {
                    genericLog(`err: \n ${err}`, 'red');
                });
        } else {
            return qfs.read(fullFilePath)
                .then((content) => {
                    const editedContent = regexReplaceCustomBoilerplateString(content, fileName);
                    return qfs.write(`${cwd}/${fileName}`, editedContent);
                })
                .then(() => {
                    genericLog(`${fileName} created successfully`);
                })
                .catch((err) => {
                    genericLog(`err: \n ${err}`, 'red');
                });
        }
    });
};
const _v = require('../utils/variables')();
const funcs = require('../utils/functions')();
const { baseDir } = _v;
const actionsDir = `${baseDir}/actions`;

module.exports = funcs.readFilesInDirectorySync(actionsDir)
    .filter((file) => file !== '_index.js')
    .reduce((result, file) => {
        const filename = file.split('.')[0];
        result[filename] = require(`./${filename}`);
        return result;
    }, {});
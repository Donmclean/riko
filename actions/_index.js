const _v = require('../config/variables')();
const { fs, baseDir } = _v;

module.exports = fs.readdirSync(`${baseDir}/actions`)
    .filter((file) => file !== '_index.js')
    .reduce((result, file) => {
        const filename = file.split('.')[0];
        result[filename] = require(`./${filename}`);
        return result;
    }, {});
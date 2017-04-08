const
    _v      = require('../utils/variables')(),
    funcs   = require('../utils/functions')();

module.exports = (finalPath, actionType, fileType, fileName) => {
    const { $, qfs, cwd, path } = _v;

    return qfs.read(`${finalPath}/${fileType}`)
        .then((content) => {
            const editedContent = content.replace(/<:rikofilename:>/g, path.basename(fileName.split('.')[0], path.extname(fileName)));
            return qfs.write(`${cwd}/${fileName}`, editedContent);
        })
        .then(() => {
            funcs.genericLog(`${fileName} created successfully`);
        })
        .catch((err) => {
            console.error('err: ', err);
        });
};
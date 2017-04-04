const
    _v      = require('../config/variables')(),
    funcs   = require('../config/functions')();

module.exports = (finalPath, actionType, fileType, fileName) => {
    const { $, qfs, cwd, path } = _v;

    return qfs.read(`${finalPath}/${fileType}`)
        .then((content) => {
            const editedContent = content.replace(/<:rikofilename:>/g, path.basename(fileName.split('.')[0], path.extname(fileName)));
            return qfs.write(`${cwd}/${fileName}`, editedContent);
        })
        .catch((err) => {
            console.error('err: ', err);
        });
};
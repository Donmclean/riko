const
    _v      = require('../utils/variables')(),
    funcs   = require('../utils/functions')(),
    actions = require('../actions/_index');

module.exports = (argv) => {
    const { $, baseDir, _ } = _v;

    const defaultSetupOptionsPath = `${baseDir}/bin/_setup`;
    const projectTypes = funcs.readFilesInDirectorySync(defaultSetupOptionsPath);

    const defaultQuestions = [
        {
            type: 'list',
            name: 'projectType',
            message: 'What type of project are you creating?',
            choices: projectTypes,
            filter: (val) => val.toLowerCase()
        },
        {
            type: 'input',
            name: 'projectName',
            message: `What's the name of your project?`,
            filter: (val) => funcs.sanitizeString(val),
            validate: (value) => _.isEmpty(value) ? 'Please enter a valid project name' : true
        },
    ];

    _v.inquirer.prompt(defaultQuestions)
        .then((answers) => {
            const { projectType, projectName } = answers;
            actions.setup('setup', projectType, projectName);
        })
        .catch((err) => {
            console.error('err > : ', err);
        });
};
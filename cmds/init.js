const
    _v      = require('../utils/variables')(),
    funcs   = require('../utils/functions')(),
    actions = require('../actions/_index');

module.exports = () => {
    const { baseDir, _ } = _v;

    const defaultSetupOptionsPath = `${baseDir}/bin/_setup`;
    const defaultTemplateTypesPath = `${baseDir}/bin/_setup/react/src/templates`;
    const projectTypes = funcs.readFilesInDirectorySync(defaultSetupOptionsPath);
    const templateTypes = funcs.readFilesInDirectorySync(defaultTemplateTypesPath);

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
        {
            type: 'list',
            name: 'templateFile',
            message: 'What template engine would you like to use?',
            choices: templateTypes,
            filter: (val) => val.toLowerCase(),
            when: (currentAnswers) => {
                const { projectType } = currentAnswers;
                return funcs.requiresTemplate(projectType);
            }
        }
    ];

    _v.inquirer.prompt(defaultQuestions)
        .then((currentAnswers) => {
            let { projectType, projectName } = currentAnswers;
            //TODO: validate existence of these ^

            projectName = funcs.sanitizeString(funcs.hasWhiteSpace(projectName) ? _v._.camelCase(projectName) : projectName);

            actions.setup('setup', projectType, projectName);
        })
        .catch((err) => {
            console.error('err > : ', err);
        });
};
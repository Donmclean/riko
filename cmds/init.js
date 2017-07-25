import { baseDir } from '../utils/variables';
import { isEmpty, camelCase } from 'lodash';
import inquirer from 'inquirer';
import { readFilesInDirectorySync, sanitizeString, requiresTemplate, hasWhiteSpace, genericLog } from '../utils/functions';
import setup from '../actions/setup';

export default () => {
    const defaultSetupOptionsPath = `${baseDir}/bin/_setup`;
    const defaultTemplateTypesPath = `${baseDir}/bin/_setup/react/src/templates`;
    const projectTypes = readFilesInDirectorySync(defaultSetupOptionsPath);
    const templateTypes = readFilesInDirectorySync(defaultTemplateTypesPath);

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
            filter: (val) => sanitizeString(val),
            validate: (value) => isEmpty(value) ? 'Please enter a valid project name' : true
        },
        {
            type: 'list',
            name: 'templateFile',
            message: 'What template engine would you like to use?',
            choices: templateTypes,
            filter: (val) => val.toLowerCase(),
            when: (currentAnswers) => {
                const { projectType } = currentAnswers;
                return requiresTemplate(projectType);
            }
        }
    ];

    inquirer.prompt(defaultQuestions)
        .then((currentAnswers) => {
            let { projectType, projectName } = currentAnswers;
            //TODO: validate existence of these ^

            projectName = sanitizeString(hasWhiteSpace(projectName) ? camelCase(projectName) : projectName);

            setup('setup', projectType, projectName);
        })
        .catch((err) => {
            genericLog('err > ' + err, 'red');
        });
};
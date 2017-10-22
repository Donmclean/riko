import { genericLog, folderAlreadyPresent, sortObjByOwnKeys } from '../utils/functions';
import { cwd, baseDir, packageJson } from '../utils/variables';
import fs from 'fs-extra';
import spawn from 'cross-spawn';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const spawnSync = spawn.sync;

export default async (actionType, projectType, projectName) => {
    const logSuccess = () => genericLog(`${$.util.colors.blue(projectName)} was setup ${$.util.colors.green('successfully')}`);

    let userCWDfiles;

    try {
        userCWDfiles = await fs.readdir(cwd);
    } catch (err) {
        console.error(`ERROR > error reading cwd (${cwd})`, err);
    }

    if(folderAlreadyPresent(userCWDfiles, projectName)) {
        genericLog(`${$.util.colors.blue(projectName)} folder must not exist during setup. ${$.util.colors.red('terminating...')}`);
        throw new Error(`${projectName} folder must not exist during setup.`);
    } else {
        switch (projectType) {
            case 'electron': {
                try {
                    await fs.copy(`${baseDir}/bin/_${actionType}/react`, `${cwd}/${projectName}`);
                    await fs.copy(`${baseDir}/bin/_${actionType}/${projectType}`, `${cwd}/${projectName}/src`);
                } catch (err) {
                    console.error(`ERROR > error copying files to new project (${projectName})`, err);
                }

                let customPackageJson;
                try {
                    customPackageJson = await fs.readJson(`${cwd}/${projectName}/package.json`);
                } catch (err) {
                    console.error('ERROR > error reading package.json', err);
                }

                //adds electron as devDependencies to package.json
                customPackageJson.devDependencies = Object.assign(
                    {},
                    customPackageJson.devDependencies,
                    {electron: packageJson.dependencies.electron}
                );

                customPackageJson.devDependencies = sortObjByOwnKeys(customPackageJson.devDependencies);

                try {
                    const jsonFormattingOptions = { spaces: "\t" };
                    await fs.writeJson(`${cwd}/${projectName}/package.json`, customPackageJson, jsonFormattingOptions);
                } catch (err) {
                    console.error('ERROR > error writing to package.json', err);
                }

                logSuccess();

                break;
            }
            case 'node-server':
            case 'react': {
                try {
                    await fs.copy(`${baseDir}/bin/_${actionType}/${projectType}`, `${cwd}/${projectName}`);
                } catch (err) {
                    console.error(`ERROR > error copying files to new project (${projectName})`, err);
                }

                logSuccess();
                break;
            }
            case 'react-native': {
                //run react native shell script
                spawnSync('sh', [`${baseDir}/bin/_${actionType}/${projectType}/react-native-install.sh`, projectName], {stdio: 'inherit'});

                try {
                    await fs.ensureDir(`${cwd}/${projectName}/src`);
                } catch (err) {
                    console.error(`ERROR > error creating directory (${cwd}/${projectName}/src)`, err);
                }

                //copy bin rikoconfig.js file to user project src directory
                try {
                    await fs.copy(`${baseDir}/bin/_${actionType}/${projectType}/rikoconfig.js`, `${cwd}/${projectName}/src/rikoconfig.js`);
                } catch (err) {
                    console.error(`ERROR > error copying files to new project (${projectName})`, err);
                }

                genericLog(`${$.util.colors.blue(`${projectName}`)} folder created ${$.util.colors.green('successfully')}`);

                break;
            }
            default: {
                break;
            }
        }
    }
};
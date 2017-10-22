import { regexReplaceCustomBoilerplateString, genericLog } from '../utils/functions';
import { cwd } from '../utils/variables';
import fs from 'fs-extra';
import regexReplace from 'regex-replace';

export default async (finalPath, actionType, fileType, fileName) => {
    const fullBinFilePath = `${finalPath}/${fileType}`;

    const filePathStats = await fs.stat(fullBinFilePath);

    //handle Directories
    if(filePathStats.isDirectory()) {
        try {
            await fs.copy(fullBinFilePath, `${cwd}/${fileName}`);
        } catch (err) {
            console.error(`ERROR > error creating directory (${cwd}/${fileName})`, err);
            return 1;
        }

        try {
            await regexReplace('<:rikofilename:>', fileName, `${cwd}/${fileName}`);
        } catch (err) {
            console.error(`ERROR > error replacing custom filenames in (${cwd}/${fileName})`, err);
            return 1;
        }

        genericLog(`${fileName} created successfully`);

    } else { //handle files
        let customizedFile;
        try {
            customizedFile = await fs.readFile(fullBinFilePath, 'utf8');
        } catch (err) {
            console.error(`ERROR > error reading file (${cwd}/${fileName})`, err);
            return 1;
        }

        const editedContent = regexReplaceCustomBoilerplateString(customizedFile, fileName);

        try {
            await fs.writeFile(`${cwd}/${fileName}`, editedContent);
        } catch (err) {
            console.error(`ERROR > error writing to file (${cwd}/${fileName})`, err);
            return 1;
        }

        genericLog(`${fileName} created successfully`);
    }
};
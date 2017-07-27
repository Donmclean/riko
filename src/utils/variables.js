/*eslint-disable*/
import path from 'path';
import packageJsonFile from '../../package.json';

export const baseDir        = path.resolve(__dirname, '../../');
export const packageJson    = packageJsonFile;
export const cwd            = process.cwd();
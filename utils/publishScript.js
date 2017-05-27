const
    packageJson = require('../package.json'),
    _v          = require('./variables')(),
    readMePath  = _v.path.resolve(__dirname, `../README.md`);

const readMe = _v.fs.readFileSync(readMePath, 'utf8');

const urlStringStart = 'https://img.shields.io/badge/npm-v';
const urlStringEnd = '-blue.svg';

const npmBadgeVersionUrl = readMe.substring(readMe.indexOf(urlStringStart), (readMe.indexOf(urlStringEnd) + urlStringEnd.length));

if(npmBadgeVersionUrl) {
    return _v.fs.writeFileSync(readMePath, readMe.replace(npmBadgeVersionUrl, urlStringStart + packageJson.version + urlStringEnd));
} else {
    throw new Error('npmBadgeVersionUrl is invalid');
}

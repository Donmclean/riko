const _v = require('./config/variables')();
const tasks = require('./tasks');
const funcs = require('./config/functions')();

_v.program
    .version('2.0.0')
    .option('-s, --setup <project-type>', 'select a project type to create. -> [js, web, electron, mobile]')
    .parse(process.argv);

//get args
const args = _v.program.args;

//handle setup
const setupOptions = _v.program.setup;
if(setupOptions) {
    tasks.setupWeb(setupOptions, args);
}
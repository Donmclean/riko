const _v = require('./config/variables')();
const tasks = require('./tasks');

_v.program
    .version('2.0.0')
    .option('-s, --setup [project-type] [path] [name]', 'a new project type')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq-sauce', 'Add bbq sauce')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

//get args
const args = _v.program.args;

//handle setup
const setupOptions = _v.program.setup;
if(setupOptions) {
    tasks.setupWeb(setupOptions, args);
}


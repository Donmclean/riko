// execute a single shell command where "cmd" is a string
module.exports.exec = (cmd, cb) => {
    const child_process = require('child_process');
    const parts = cmd.split(/\s+/g);
    const p = child_process.spawn(parts[0], parts.slice(1), {stdio: 'inherit'});

    p.on('exit', (code) => {
        let err = null;
        if (code) {
            err = new Error('command "'+ cmd +'" exited with wrong status code "'+ code +'"');
            err.code = code;
            err.cmd = cmd;
        }
        if (cb) cb(err);
    });
};


// execute multiple commands in series
// this could be replaced by any flow control lib
module.exports.series = (cmds, cb) => {
    const execNext = () => {
        exports.exec(cmds.shift(), (err) => {
            if (err) {
                cb(err);
            } else if (cmds.length) {
                execNext();
            } else {
                cb(null);
            }
        });
    };
    execNext();
};
function runCommand(command, cwd, env) {
    var cwd = cwd || process.cwd();
    var env = apply(env || {}, Object.create(process.env));

    var result = {
        error: null,
        exitCode: 0,
        stdout: '',
        stderr: ''
    };

    function stdout(message) {
        result.stdout += message;
    }

    function stderr(message) {
        result.stderr += message;
    }

    var args = command.split(' ');
    command = args.shift();
    var options = {
        cwd,
        env
    };

    return new Promise(function(accept, reject) {
        var child = require('child_process')
            .spawn(command, args, options)
            .on('error', function(error) {
                result.error = error;
                reject(result);
            }).on('exit', function(exitCode) {
                result.exitCode = exitCode;
                accept(result);
            });
        child.stdout.on('data', stdout);
        child.stderr.on('data', stderr);
    });
}

function apply(properties, target) {
    Object.keys(properties)
        .forEach((key) => {
            target[key] = properties[key];
        });
    return target;
}

module.exports = runCommand;
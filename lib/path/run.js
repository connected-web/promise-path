function runCommand(command, cwd) {
    var cwd = cwd || process.cwd();
    var NL = '\n';
    var result = {
        error: null,
        stdout: '',
        stderr: '',
        exitCode: undefined
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
        cwd
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

module.exports = runCommand;
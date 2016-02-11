function runCommand(command) {
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

    return new Promise(function(accept, reject) {
        var process = require('child_process')
            .spawn(command, args)
            .on('error', function(error) {
                result.error = error;
                reject(result);
            }).on('exit', function(exitCode) {
                result.exitCode = exitCode;
                accept(result);
            });
        process.stdout.on('data', stdout);
        process.stderr.on('data', stderr);
    });
}

module.exports = runCommand;
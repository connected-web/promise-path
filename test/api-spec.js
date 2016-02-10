const api = require('../api');
const expect = require('chai').expect;

var pending = function(done) {
    done('Pending implementation');
};

describe('API', function() {
    describe('clean', function() {
        var someFile = 'temp/some-file.txt';
        beforeEach(function(done) {
            api.write(someFile, 'Some Data').then(done).catch(done);
        });

        it('should remove all files and folders in a directory', function(done) {
            api.clean('temp')
                .then(() => api.read(someFile))
                .then(function() {
                    done('Unexpected file still exists');
                }).catch(function(ex) {
                    done();
                });
        });
    });

    describe('fetch', function() {
        var remoteFile = 'https://raw.githubusercontent.com/connected-web/remote-test/master/info.json';
        it('should fetch a remote file', function(done) {
            api.fetch(remoteFile)
                .then(JSON.parse)
                .then(function(data) {
                    expect(data.message).to.equal(`If you're reading this JSON file you've successfully accessed the remote test`);
                })
                .then(done)
                .catch(done);
        });
    });

    describe('find', function() {

        function stripPath(path, file) {
            return file.replace(path, '');
        }

        it('should return a list of files based on a glob pattern', function(done) {
            var path = 'lib/path/';
            api.find(path + '*.js')
                .then((files) => files.map((file) => file.replace(path, '')))
                .then(function(files) {
                    expect(files).to.deep.equal([
                        'clean.js',
                        'fetch.js',
                        'find.js',
                        'read.js',
                        'run.js',
                        'write.js'
                    ]);
                })
                .then(done)
                .catch(done);
        });
    });

    describe('read', function() {
        it('should read the contents of a file', function(done) {
            api.read(__dirname + '/fixtures/sample.txt', 'utf8')
                .then(function(contents) {
                    expect(contents).to.equal(`Sample file with sample contents.`);
                })
                .then(done)
                .catch(done);
        });
    });

    describe('write', function() {
        it('should write contents to a file', function(done) {
            var file = 'temp/test.log';
            var expectedContents = 'Sample log with sample text';
            api.clean('temp')
                .then(() => api.write(file, expectedContents))
                .then(() => api.read(file, 'utf8'))
                .then(function(actualContents) {
                    expect(actualContents).to.equal(expectedContents);
                })
                .then(() => api.clean('temp'))
                .then(done)
                .catch(done);
        });
    });

    describe('run', function() {
        it('should run the supplied command, and return the result', function(done) {
            var file = 'test/fixtures/sample.txt';
            var expected;

            api.read(file, 'utf8')
                .then(function(body) {
                    expected = {
                        error: null,
                        stdout: body,
                        stderr: ''
                    };
                })
                .then(() => api.run(`cat ${file}`))
                .then(function(actual) {
                    expect(actual).to.deep.equal(expected);
                })
                .then(done)
                .catch(done);
        });
    });
});
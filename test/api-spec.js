const expect = require('chai').expect;

var pending = function(done) {
    done('Pending implementation');
};

describe('API', function() {
    describe('clean', function() {
        it('should remove all files and folders in a directory', function(done) {
            pending(done);
        });
    });

    describe('fetch', function() {
        it('should fetch a remote file', function(done) {
            pending(done);
        });
    });

    describe('find', function() {
        it('should return a list of files based on a glob pattern', function(done) {
            pending(done);
        });
    });

    describe('read', function() {
        it('should read the contents of a file', function(done) {
            pending(done);
        });
    });

    describe('write', function() {
        it('should write contents to a file', function(done) {
            pending(done);
        });
    });
});
/* eslint-env mocha */
const fs = require('fs')
const path = require('path')
const api = require('../api')
const expect = require('chai').expect

describe('API', function () {
  describe('clean', function () {
    const someFile = 'temp/some-file.txt'
    beforeEach(function (done) {
      api.write(someFile, 'Some Data').then(done).catch(done)
    })

    it('should remove all files and folders in a directory', function (done) {
      api.clean('temp')
        .then(() => api.read(someFile))
        .then(function () {
          done('Unexpected file still exists')
        }).catch(function (ex) {
          done()
        })
    })
  })

  describe('fetch', function () {
    const remoteFile = 'https://raw.githubusercontent.com/connected-web/remote-test/master/info.json'
    it('should fetch a remote file', function (done) {
      api.fetch(remoteFile)
        .then(JSON.parse)
        .then(function (data) {
          expect(data.message).to.equal(`If you're reading this JSON file you've successfully accessed the remote test`)
        })
        .then(done)
        .catch(done)
    })
  })

  describe('find', function () {
    it('should return a list of files based on a glob pattern', function (done) {
      const dir = 'lib/path/'
      api.find(path.join(dir, '*.js'))
        .then((files) => files.map((file) => file.replace(dir, '')))
        .then(function (files) {
          expect(files).to.deep.equal([
            'clean.js',
            'fetch.js',
            'find.js',
            'make.js',
            'read.js',
            'run.js',
            'write.js'
          ])
        })
        .then(done)
        .catch(done)
    })
  })

  describe('read', function () {
    it('should read the contents of a file', function (done) {
      api.read(path.join(__dirname, 'fixtures/sample.txt'), 'utf8')
        .then(function (contents) {
          expect(contents).to.equal(`Sample file with sample contents.`)
        })
        .then(done)
        .catch(done)
    })
  })

  describe('write', function () {
    it('should write contents to a file', function (done) {
      const file = 'temp/test.log'
      const expectedContents = 'Sample log with sample text'
      api.clean('temp')
        .then(() => api.write(file, expectedContents))
        .then(() => api.read(file, 'utf8'))
        .then(function (actualContents) {
          expect(actualContents).to.equal(expectedContents)
        })
        .then(() => api.clean('temp'))
        .then(done)
        .catch(done)
    })
  })

  describe('make', function () {
    it('should make a directory if it does not exist', function (done) {
      const directory = 'temp/new-directory'
      api.clean('temp')
        .then(() => api.make(directory))
        .then(function (result) {
          const stats = fs.lstatSync(directory)
          // Is it a directory?
          expect(stats.isDirectory()).to.equal(true)
        })
        .then(() => api.clean('temp'))
        .then(done)
        .catch(done)
    })

    it('should succeed if the directory already exists', function (done) {
      const directory = 'temp/new-directory'
      api.clean('temp')
        .then(() => api.make(directory))
        .then(() => api.make(directory))
        .then(function (result) {
          const stats = fs.lstatSync(directory)
          // Is it a directory?
          expect(stats.isDirectory()).to.equal(true)
        })
        .then(() => api.clean('temp'))
        .then(done)
        .catch(done)
    })
  })

  describe('run', function () {
    it('should run the supplied command, and return the result', function (done) {
      const file = path.join(__dirname, 'fixtures/sample.txt')
      let expected

      api.read(file, 'utf8')
        .then(function (body) {
          expected = {
            error: null,
            exitCode: 0,
            stdout: body,
            stderr: ''
          }
        })
        .then(() => api.run(`cat ${file}`))
        .then(function (actual) {
          expect(actual).to.deep.equal(expected)
        })
        .then(done)
        .catch(done)
    })

    it('should be able to run a command in a different working directory, and return the result', function (done) {
      const dir = 'test/fixtures'
      const file = 'sample.txt'
      let expected

      api.read(path.join(dir, file), 'utf8')
        .then(function (body) {
          expected = {
            error: null,
            exitCode: 0,
            stdout: body,
            stderr: ''
          }
        })
        .then(() => api.run(`cat ${file}`, path.join(process.cwd(), dir)))
        .then(function (actual) {
          expect(actual).to.deep.equal(expected)
        })
        .then(done)
        .catch(done)
    })

    it('should pass environment variables through to the child process', function (done) {
      const env = {
        x: 1 + Math.random(),
        y: 2 + Math.random(),
        z: 3 + Math.random()
      }
      const expected = {
        error: null,
        exitCode: 0,
        stdout: `${env.x} ${env.y} ${env.z}\n`,
        stderr: ''
      }

      api.run('node env.js', path.join(__dirname, 'fixtures'), env)
        .then(function (actual) {
          expect(actual).to.deep.equal(expected)
        })
        .then(done)
        .catch(done)
    })

    it('should run a complex chain of asychronous commands, and return the result', function (done) {
      this.timeout(15000)

      const expected = {
        error: null,
        exitCode: 0,
        stdout: {
          'dependencies': {
            'denodeify': {
              'from': 'denodeify@*',
              'resolved': 'https://registry.npmjs.org/denodeify/-/denodeify-1.2.1.tgz',
              'version': '1.2.1'
            }
          },
          'name': 'promise-path',
          'version': '1.2.5'
        },
        stderr: ''
      }

      api.run(`rm -rf node_modules/denodeify`)
        .then(() => api.run(`npm install denodeify --json`))
        .then(function (actual) {
          actual.stdout = JSON.parse(actual.stdout)
          expect(actual).to.deep.equal(expected)
        })
        .then(done)
        .catch(done)
    })
  })
})

/* eslint-env mocha */
const fs = require('fs')
const path = require('path')
const api = require('../api')
const expect = require('chai').expect

describe('API', () => {
  describe('clean', () => {
    const someFile = 'temp/some-file.txt'
    beforeEach(function (done) {
      api.write(someFile, 'Some Data').then(done).catch(done)
    })

    it('should remove all files and folders in a directory', async () => {
      await api.clean('temp')
      try {
        await api.read(someFile)
      } catch (ex) {
        const actual = (ex || {}).code
        return expect(actual).to.equal('ENOENT')
      }
      throw new Error('Unexpected file still exists')
    })
  })

  describe('fetch', () => {
    const remoteFile = 'https://raw.githubusercontent.com/connected-web/remote-test/master/info.json'
    it('should fetch a remote file', async () => {
      const file = await api.fetch(remoteFile)
      const data = JSON.parse(file)
      expect(data.message).to.equal('If you\'re reading this JSON file you\'ve successfully accessed the remote test')
    })
  })

  describe('find', () => {
    it('should return a list of files based on a glob pattern', async () => {
      const dir = 'lib/path/'
      const filepaths = await api.find(path.join(dir, '*.js'))
      const actual = filepaths.map((file) => file.replace(dir, ''))
      const expected = [
        'clean.js',
        'fetch.js',
        'find.js',
        'make.js',
        'position.js',
        'read.js',
        'run.js',
        'write.js'
      ]
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('read', () => {
    it('should read the contents of a file', async () => {
      const contents = await api.read(path.join(__dirname, 'fixtures/sample.txt'), 'utf8')
      expect(contents).to.equal('Sample file with sample contents.')
    })
  })

  describe('write', () => {
    it('should write contents to a file', async () => {
      const file = 'temp/test.log'
      const expected = 'Sample log with sample text'
      await api.clean('temp')
      await api.write(file, expected)
      const actual = await api.read(file, 'utf8')
      expect(actual).to.equal(expected)
    })

    afterEach(() => {
      api.clean('temp')
    })
  })

  describe('make', () => {
    it('should make a directory if it does not exist', async () => {
      const directory = 'temp/new-directory'
      await api.clean('temp')
      await api.make(directory)
      const stats = fs.lstatSync(directory)
      // Is it a directory?
      expect(stats.isDirectory()).to.equal(true)
    })

    it('should succeed if the directory already exists', async () => {
      const directory = 'temp/new-directory'
      await api.clean('temp')
      await api.make(directory)
      await api.make(directory) // x2
      const stats = fs.lstatSync(directory)
      // Is it a directory?
      expect(stats.isDirectory()).to.equal(true)
    })

    afterEach(() => {
      api.clean('temp')
    })
  })

  describe('position', () => {
    it('should initialse a function that positions relative to the supplied path', () => {
      const position = api.position('/somewhere/away/')
      const actual = position('/elsewhere/here.dat')
      const expected = '/somewhere/away/elsewhere/here.dat'
      expect(actual).to.equal(expected)
    })
  })

  describe('run', () => {
    it('should run the supplied command, and return the result', async () => {
      const file = path.join(__dirname, 'fixtures/sample.txt')
      const body = await api.read(file, 'utf8')
      const expected = {
        error: null,
        exitCode: 0,
        stdout: body,
        stderr: ''
      }
      const actual = await api.run(`cat ${file}`)
      expect(actual).to.deep.equal(expected)
    })

    it('should be able to run a command in a different working directory, and return the result', async () => {
      const dir = 'test/fixtures'
      const file = 'sample.txt'
      const body = await api.read(path.join(dir, file), 'utf8')
      const expected = {
        error: null,
        exitCode: 0,
        stdout: body,
        stderr: ''
      }
      const actual = await api.run(`cat ${file}`, path.join(process.cwd(), dir))
      expect(actual).to.deep.equal(expected)
    })

    it('should pass environment variables through to the child process', async () => {
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
      const actual = await api.run('node env.js', path.join(__dirname, 'fixtures'), env)
      expect(actual).to.deep.equal(expected)
    })

    it('should run a command with quoted value containing spaces', async () => {
      const expected = {
        error: null,
        exitCode: 1,
        stdout: '',
        stderr: 'cat: "the file name": No such file or directory\n'
      }
      const actual = await api.run('cat "the file name"')
      actual.stderr = actual.stderr.replace(/'/g, '')
      expect(actual).to.deep.equal(expected)
    })

    it('should run a command with quoted values', async () => {
      const expected = {
        error: null,
        exitCode: 1,
        stdout: '',
        stderr: 'cat: "nospacequote": No such file or directory\n'
      }
      const actual = await api.run('cat "nospacequote"')
      actual.stderr = actual.stderr.replace(/'/g, '')
      expect(actual).to.deep.equal(expected)
    })

    it('should run a complex chain of asychronous commands, and return the result', async () => {
      const expected = {
        error: null,
        exitCode: 0,
        stdout: '',
        stderr: ''
      }
      await api.run('touch hello.txt')
      await api.run('cat hello.txt')
      const actual = await api.run('rm hello.txt')
      expect(actual).to.deep.equal(expected)
    }).timeout(1500)
  })
})

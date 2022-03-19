# Promise Path
A collection of promise based path operations including `read`, `write`, `find`, `fetch`, `make`, `clean`, `position`, and `run`.

Quick start:
```
npm install promise-path
```
Then pick the features you need:
```
const { read, write, find, fetch, make, clean, position, run } = require('promise-path')
```

## API
The API currently supports the following methods `read`, `write`, `find`, `fetch`, `make`, `clean`, `position`, and `run` as follows:

### Read
Read the contents of a file, and return the result as a promise.

```js
const { read } = require('promise-path')

let promise = (async () => {
  const readme = await read('README.md', 'utf8')
  console.log('Readme file:', readme)

  const json = JSON.parse(await read('package.json'))
  console.log(JSON.stringify(json, null, '  '))
})()
```

### Write
Write contents to a file, and return a promise.

```js
const { write } = require('promise-path')

let promise = (async () => {
  const log = ['message 1', 'message 2', 'message 3']
  const file = 'output.log'
  await write(file, log.join('\n'))
  console.log('Contents written to', file)
})()

```

### Find
Find files that match a pattern, and return a promise.

```js
const { find } = require('promise-path')

let promise = (async () => {
  const filepaths = await find('./lib/**/*.js')
  console.log('JS files:', filepaths)
})()
```

### Fetch
Retrieve a remote file, and return a promise.

```js
const { fetch } = require('promise-path')

let promise = (async () => {
  const fileContents = await fetch('https://raw.githubusercontent.com/connected-web/remote-test/master/info.json')
  console.log('Remote file:', fileContents)
})()
```

```js
const { fetch } = require('promise-path')

let promise = (async () => {
  const GITHUB_PERSONAL_ACCESS_TOKEN = process.argv[1] || ''
  const apiContents = await fetch({
    url: 'https://api.github.com/repos/connected-web/promise-path/contents/readme',
    headers: {
      'Authorization': `token ${GITHUB_PERSONAL_ACCESS_TOKEN}`,
      'Accept': 'application/vnd.github.v3.raw',
      'User-Agent': `My App - node ${process.version}`
    }
  })
  console.log('Remote file:', apiContents)
})()
```

### Clean
Remove local files and folders, and return a promise.

```js
const { clean } = require('promise-path')
const path = require('path')

let promise = (async () => {
  await clean(path.join(__dirname, '/temp'))
  console.log('Temp directory has been removed')
})
```

### Make
Use `mkdirp` to make a directory, and return a promise.

```js
const { make } = require('promise-path')
const path = require('path')

let promise = (async () => {
  await make(path.join(__dirname, '/temp'))
  console.log('Temp directory has been created')
})()
```

### Position
Create a function that helps you position new paths relative to a base path:
```js
const { position } = require('promise-path')(__dirname, '../data')
const filepath = position('item-list.json')
console.log('Avoids having to use path.join directly:', filepath)
```

### Run
Use `child_process.exec` to run a command, and return a promise.

```js
const  { run } = require('promise-path')

let promise = (async () => {
  try {
    const result = await run('cat package.json')
    console.log('Error', result.error)
    console.log('Exit code', result.exitCode)
    console.log('Std out', result.stdout)
    console.log('Std err', result.stderr)
  }
  catch(ex) {
    console.error(ex)
  }
})()
```

With a current working directory (cwd), and custom environment variables (env):

```js
const { run } = require('promise-path')

let promise = (async () => {
  const cwd = process.cwd()
  const env = {HOME: process.cwd()}
  try {
    const result = await run('npm install', cwd, env)
    console.log('Error', result.error)
    console.log('Exit code', result.exitCode)
    console.log('Std out', result.stdout)
    console.log('Std err', result.stderr)
  }
  catch(ex) {
    console.error(ex)
  }
})()
```

## Depdencies
- denodeify
- glob
- fs-extra
- request

## Development
Checkout the code, then:

```
npm install
npm test
```

## Changelog

### 1.4.2
- Update package dependencies to latest versions

### 1.4.0
- Remove dependency the `denodeify` package

### 1.3.1
- Update package dependencies to latest versions

### 1.3.0
- Add `position` command to create a path friendly helper function
- Update `examples.js` and fix typos in README.md

### 1.2.7
- Rewrite all tests and examples using async await style
- Add `examples.js` file to harness worked examples in README.md

### 1.2.6
- Support quoted spaces in commands
- e.g. `git commit -m "Some message with spaces"`

### 1.2.4
- Updated node dependencies
- Added example for fetching data from the github API with headers

### 1.2.3
- Updated node dependencies
- Changed run to use `process.env.comspec` on windows, to reduce `ENOENT` errors

### 1.2.2
- Added `make` command

### 1.2.1
- Added `env` : environment variables as option to `run`

### 1.2.0
- Added `cwd` as a second optional parameter to `run`

### 1.1.1
- Reworked `run` command to use `child_process.spawn`
- Added `exitCode` to the return object on `run`

### 1.1.0
- Added method with test: `run`

### 1.0.0
- Initial release
- Supported methods: `read`, `write`, `find`, `fetch`, `clean`
- Created tests

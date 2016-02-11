# Promise Path
A collection of path based methods brought together as promises.

## API
The API currently supports the following methods:
- read
- write
- find
- fetch
- clean

### Read
Read the contents of a file, and return the result as a promise.

```js
var read = require('promise-path').read;

read('README.md', 'utf8')
    .then(function(contents) {
        console.log(contents);
    });

read('package.json')
    .then(JSON.parse)
    .then(function(json) {
        console.log(JSON.stringify(json), null, '  ');
    });
```

### Write
Write contents to a file, and return a promise.

```js
var write = require('promise-path').write;

var log = ['message 1', 'message 2', 'message 3'];
var file = 'output.log';
write(file, log.join('\n'))
    .then(function() {
        console.log('Contents written to', file);
    });
```

### Find
Find files that match a pattern, and return a promise.

```js
var find = require('promise-path').find;

find('/**/*.js')
    .then(function(files) {
        console.log('JS files:', files);
    });
```

### Fetch
Retrieve a remote file, and return a promise.

```js
var fetch = require('promise-path').fetch;

fetch('https://raw.githubusercontent.com/connected-web/remote-test/master/info.json')
    .then(function(contents) {
        console.log('Remote file:', contents);
    });
```

### Clean
Remove local files and folders, and return a promise.

```js
var clean = require('promise-path').clean;

clean(__dirname + '/temp')
    .then(function() {
        console.log('Temp directory has been removed');
    });
```

### Run
Use `child_process.exec` to run a command, and return a promise.

```js
var run = require('promise-path').run;

run('cat package.json')
    .then(function(result) {
        console.log('Error', result.error);
        console.log('Exit code', result.exitCode);
        console.log('Std out', result.stdout);
        console.log('Std err', result.stderr);
    })
    .catch((result) => console.log(result));
```

With a current working directory:

```js
var run = require('promise-path').run;

run('npm install', process.cwd() + '/release')
    .then(function(result) {
        console.log('Error', result.error);
        console.log('Exit code', result.exitCode);
        console.log('Std out', result.stdout);
        console.log('Std err', result.stderr);
    })
    .catch((result) => console.log(result));
```

## Depdencies
- glob
- fs-extra
- request

## Development
Checkout the code.

```
npm install
npm test
```

## Changelog
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

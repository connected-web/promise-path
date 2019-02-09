/* Harness code for the examples in README.md */
const api = require('./api')
const { read, write, find, fetch, clean, make, run } = api
const position = api.position(__dirname)

let promise = (async () => {
  // Read
  const readme = await read('README.md', 'utf8')
  console.log('Readme file:', readme.length, 'bytes', 'First 100 characters:', readme.substring(0, 100), '...')

  const json = JSON.parse(await read('package.json'))
  const jsonText = JSON.stringify(json, null, '  ')
  console.log('Package.json:', jsonText.length, 'bytes', 'First 100 characters:', jsonText.substring(0, 100), '...')

  // Write
  const log = ['message 1', 'message 2', 'message 3']
  const file = 'output.log'
  await write(file, log.join('\n'))
  console.log('Contents written to', file)

  // Find
  const filepaths = await find('./lib/**/*.js')
  console.log('JS files:', filepaths)

  // Fetch
  const fileContents = await fetch('https://raw.githubusercontent.com/connected-web/remote-test/master/info.json')
  console.log('Remote file:', fileContents)

  // Fetch with token
  const GITHUB_PERSONAL_ACCESS_TOKEN = process.argv[1] || ''
  const apiContents = await fetch({
    url: 'https://api.github.com/repos/connected-web/promise-path/contents/readme',
    headers: {
      'Authorization': `token ${GITHUB_PERSONAL_ACCESS_TOKEN}`,
      'Accept': 'application/vnd.github.v3.raw',
      'User-Agent': `My App - node ${process.version}`
    }
  })
  console.log('Remote file:', apiContents.length, 'bytes', 'First 100 characters:', apiContents.substring(0, 100), '...')

  // Position
  const tempPath = position('/temp')
  console.log('Temp directory lives at:', tempPath)

  // Clean
  await clean(tempPath)
  console.log('Temp directory has been removed')

  // Make
  await make(tempPath)
  console.log('Temp directory has been created')

  // Run
  try {
    const result = await run('cat package.json')
    console.log('Error', result.error)
    console.log('Exit code', result.exitCode)
    console.log('Std out', result.stdout)
    console.log('Std err', result.stderr)
  } catch (ex) {
    console.error(ex)
  }

  // Run with cwd and env
  const cwd = process.cwd()
  const env = { HOME: process.cwd() }
  try {
    const result = await run('npm install', cwd, env)
    console.log('Error', result.error)
    console.log('Exit code', result.exitCode)
    console.log('Std out', result.stdout)
    console.log('Std err', result.stderr)
  } catch (ex) {
    console.error(ex)
  }
})()

console.log('I promise to do all the things... eventually:', promise)

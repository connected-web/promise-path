/* Harness code for the examples in README.md */
const { read, write, find, fetch, clean, make, run } = require('./api')

let promise = (async () => {
  // Read
  const readme = await read('README.md', 'utf8')
  console.log('Readme file:', readme)

  const json = JSON.parse(await read('package.json'))
  console.log(JSON.stringify(json, null, '  '))

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
  console.log('Remote file:', apiContents)

  // Clean
  await clean(__dirname + '/temp')
  console.log('Temp directory has been removed')

  // Make
  await make(__dirname + '/temp')
  console.log('Temp directory has been created')

  // Run
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

  // Run with cwd and env
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

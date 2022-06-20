const isWin = /^win/.test(process.platform)
const quote = '"'

function joinQuotes (args) {
  const result = []

  let compressedArgs = false
  args.forEach((arg) => {
    if (arg.startsWith(quote)) {
      compressedArgs = [arg]
    } else if (compressedArgs) {
      compressedArgs.push(arg)
    } else {
      result.push(arg)
    }

    if (arg.endsWith(quote)) {
      result.push(compressedArgs.join(' '))
      compressedArgs = false
    }
  })

  return result
}

function runCommand (command, cwd, env) {
  cwd = cwd || process.cwd()
  env = apply(env || {}, Object.create(process.env))

  if (isWin) {
    command = process.env.comspec + ' /c ' + command
  }

  const result = {
    error: null,
    exitCode: 0,
    stdout: '',
    stderr: ''
  }

  function stdout (message) {
    result.stdout += message
  }

  function stderr (message) {
    result.stderr += message
  }

  const args = command.split(' ')
  command = args.shift()
  const options = {
    cwd,
    env
  }

  const stringArgs = joinQuotes(args)

  return new Promise((resolve, reject) => {
    const child = require('child_process')
      .spawn(command, stringArgs, options)
      .on('error', function (error) {
        result.error = error
        reject(result)
      }).on('exit', function (exitCode) {
        result.exitCode = exitCode
        resolve(result)
      })
    child.stdout.on('data', stdout)
    child.stderr.on('data', stderr)
  })
}

function apply (properties, target) {
  Object.keys(properties)
    .forEach((key) => {
      target[key] = properties[key]
    })
  return target
}

module.exports = runCommand

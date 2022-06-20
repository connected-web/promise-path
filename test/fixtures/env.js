/* api.run: test if environment variables are passed down to child process */
const env = process.env
console.log(env.x, env.y, env.z)

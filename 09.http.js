const http = require('node:http')
const { findAvailablePort } = require('./10-free-port')

const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  console.log('Request received!')
  res.end('Hello World!')
})

findAvailablePort(port).then((port) => {
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}).catch((err) => {
  console.error('Error finding available port', err)
})

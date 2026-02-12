const http = require('node:http')

const processRequest = (req, res) => {
  const { url, method } = req
  console.log(url, method)

  switch (method) {
    case 'GET':
      switch (url) {
        case '/':
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end('<h1>Bienvenido a mi página web</h1>')
          break
        case '/about':
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end('<h1>Esta es la página de about</h1>')
          break
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end('<h1>Página no encontrada aca?</h1>')
      }
      break

    case 'POST':
      switch (url) {
        case '/pokemon':{
          console.log('aca')

          let body = ''

          req.on('data', chunk => {
            body += chunk.toString()
          })

          req.on('end', () => {
            try {
              const data = JSON.parse(body)

              res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })
              res.end(JSON.stringify({ message: 'Pokémon creado', data }))
            } catch (error) {
              console.error('Error parsing JSON:', error)
              res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
              res.end(JSON.stringify({ message: 'Invalid JSON' }))
            }
          })

          break
        }

        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end('<h1>Página no encontrada /pokemon</h1>')
      }
  }
}

const server = http.createServer(processRequest)

server.listen(3000, () => {
  console.log('Server listening on port 3000')
})

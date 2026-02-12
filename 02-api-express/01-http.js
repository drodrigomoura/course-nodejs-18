const http = require('node:http')
const fs = require('node:fs')
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')

  if (req.url === '/') {
    console.log('Request received!', req.method, req.url)
    res.end('Bienvenido a mi página web x')
  } else if (req.url === '/wallpaper') {
    fs.readFile('wallpaper.jpg', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('Error al cargar la imagen')
      } else {
        res.setHeader('Content-Type', 'image/png')
        res.end(data)
      }
    })
  } else if (req.url === '/about') {
    console.log('Request received!', req.method, req.url)
    res.end('Esta es la página de about')
  } else {
    res.statusCode = 404
    console.log('Request received!', req.method, req.url)
    res.end('Página no encontrada')
  }
})

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

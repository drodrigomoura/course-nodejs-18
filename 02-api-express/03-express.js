const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.disable('x-powered-by')

app.use(express.json())

app.use((req, res, next) => {
  console.log('middleware', req.method, req.url)
  next()
})

app.get('/', (req, res) => {
  res.status(200).send('<h1>Bienvenido a mi página web</h1>')
})

app.post('/pokemon', (req, res) => {
//   let body = ''

  //   req.on('data', chunk => {
  //     body += chunk.toString()
  //   })

  //   req.on('end', () => {
  //     try {
  //       const data = JSON.parse(body)

  //       res.status(201).json({ message: 'Pokémon creado', data })
  //     } catch (error) {
  //       console.error('Error parsing JSON:', error)
  //       res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
  //       res.end(JSON.stringify({ message: 'Invalid JSON' }))
  //     }
  //   })

  res.status(201).json(req.body)
})

app.use((req, res) => {
  res.status(404).send('<h1>Página no encontrada</h1>')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

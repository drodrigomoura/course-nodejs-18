import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
app.disable('x-powered-by')
app.use(json())

app.use(corsMiddleware())

// movies routes
app.use('/api/v1/movies', moviesRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})

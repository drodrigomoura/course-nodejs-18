import express, { json } from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(json())

  app.use(corsMiddleware())

  // movies routes
  app.use('/api/v1/movies', createMovieRouter({ movieModel }))

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
  })
}

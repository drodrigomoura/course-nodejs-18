import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

export const createMovieRouter = ({ movieModel }) => {
  const router = Router()
  const controller = new MovieController({ movieModel })

  router.get('/', controller.getAll)
  router.get('/:id', controller.getById)
  router.post('/', controller.create)
  router.patch('/:id', controller.update)
  router.delete('/:id', controller.delete)

  return router
}

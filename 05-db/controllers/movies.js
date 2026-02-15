import { MovieModel } from '../models/mysql/movies.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static getAll = async (req, res) => {
    const { genre } = req.query

    const movies = await MovieModel.getAll({ genre })

    res.json(movies)
  }

  static getById = async (req, res) => {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    res.json(movie)
  }

  static create = async (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
      console.log(result)

      return res.status(400).json({ message: 'Invalid movie data', error: JSON.parse(result.error.message) })
    // alternatively, we can return a 422 Unprocessable Entity
    }

    const newMovie = await MovieModel.create({ input: result.data })

    console.log({ newMovie })

    res.status(201).json(newMovie)
  }

  static update = async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ message: 'Invalid movie data', error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedMovie = await MovieModel.update({ id, movieData: result.data })

    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    res.json(updatedMovie)
  }

  static delete = async (req, res) => {
    const { id } = req.params

    const result = await MovieModel.delete({ id })

    if (!result) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    res.json({ message: 'Movie deleted' })
  }
}

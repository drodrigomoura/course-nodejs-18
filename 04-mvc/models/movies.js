import { readJSON } from '../utils.js'
import { randomUUID } from 'node:crypto'

// === import json ===

// with fs
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// recommended
const movies = readJSON('./movies.json')

// node >20
// import movies from './movies.json' with { type: 'json' };

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      const filteredMovies = movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )

      if (filteredMovies.length < 1) {
        return []
      }

      return filteredMovies
    }

    return movies
  }

  static async getById (id) {
    const movie = movies.find(movie => movie.id === id)

    if (!movie) {
      return null
    }

    return movie
  }

  static async create ({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }

    movies.push(newMovie)

    return newMovie
  }

  static async update ({ id, movieData }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
      return false
    }
    const updatedMovie = { ...movies[movieIndex], ...movieData }
    movies[movieIndex] = updatedMovie

    return updatedMovie
  }

  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
      return false
    }

    movies.splice(movieIndex, 1)
    return true
  }
}

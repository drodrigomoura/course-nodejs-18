const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()
app.disable('x-powered-by')
app.use(express.json())

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'https://my-movies-app.com',
  'https://movies.com'
]

app.use(cors({
  origin: (origin, callback) => {
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

// Get all or using query parameters
app.get('/api/v1/movies', (req, res) => {
  const { genre } = req.query

  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )

    if (filteredMovies.length < 1) {
      return res.json([])
    }

    return res.json(filteredMovies)
  }
  res.json(movies)
})

// Get by id
app.get('/api/v1/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  res.json(movie)
})

// Post new movie
app.post('/api/v1/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    console.log(result)

    return res.status(400).json({ message: 'Invalid movie data', error: JSON.parse(result.error.message) })
    // alternatively, we can return a 422 Unprocessable Entity
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json({ message: 'Movie created', data: newMovie })
})

// PATCH update movie
app.patch('/api/v1/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ message: 'Invalid movie data', error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updatedMovie = { ...movies[movieIndex], ...result.data }
  movies[movieIndex] = updatedMovie

  res.json(updatedMovie)
})

// CORS
// normal methods: GET/HEAD/POST
// preflight(complex) methods: PUT/PATCH/DELETE

// CORS preflight request handler
// Options requests are sent by the browser before complex requests to check if the server allows the actual request

// app.options('/api/v1/movies/:id', (req, res) => {
//   const origin = req.headers.origin

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//   }

//   res.sendStatus(204)
// })

// DELETE movie
app.delete('/api/v1/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  res.json({ message: 'Movie deleted' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})

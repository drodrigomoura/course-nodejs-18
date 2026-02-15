import { MovieModel } from './models/mysql/movies.js'
import { createApp } from './app.js'

createApp({ movieModel: MovieModel })

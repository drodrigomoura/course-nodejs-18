import cors from 'cors'

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

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'https://my-movies-app.com',
  'https://movies.com'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
})

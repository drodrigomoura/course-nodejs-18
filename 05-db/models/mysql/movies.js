import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query('SELECT id, name FROM genres WHERE LOWER(name) = ?', [lowerCaseGenre])

      if (genres.length === 0) {
        return []
      }

      const [{ id }] = genres

      const [movies] = await connection.query(`
        SELECT
          BIN_TO_UUID(m.id) AS id,
          m.title,
          m.year,
          m.director,
          m.duration,
          m.poster,
          m.rate,
          IF(
            COUNT(g.name) = 0,
            JSON_ARRAY(),
            JSON_ARRAYAGG(g.name)
          ) AS genres
        FROM movies m
        LEFT JOIN movies_genres mg ON m.id = mg.movie_id
        LEFT JOIN genres g ON mg.genre_id = g.id
        WHERE m.id IN (
          SELECT mg2.movie_id
          FROM movies_genres mg2
          WHERE mg2.genre_id = ?
        )
        GROUP BY m.id
      `, [id])

      return movies
    }
    const [movies, tableInfo] = await connection.query(`
      SELECT
  BIN_TO_UUID(m.id) AS id,
  m.title,
  m.year,
  m.director,
  m.duration,
  m.poster,
  m.rate,
  IF(
    COUNT(g.name) = 0,
    JSON_ARRAY(),
    JSON_ARRAYAGG(g.name)
  ) AS genres
FROM movies m
LEFT JOIN movies_genres mg ON m.id = mg.movie_id
LEFT JOIN genres g ON mg.genre_id = g.id
GROUP BY m.id;`)

    console.log(movies, tableInfo)
    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(`
      SELECT
        BIN_TO_UUID(m.id) AS id,
        m.title,
        m.year,
        m.director,
        m.duration,
        m.poster,
        m.rate,
        IF(
          COUNT(g.name) = 0,
          JSON_ARRAY(),
          JSON_ARRAYAGG(g.name)
        ) AS genres
      FROM movies m
      LEFT JOIN movies_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.id = UUID_TO_BIN(?)
      GROUP BY m.id
    `, [id])

    if (movies.length === 0) {
      return null
    }

    return movies[0]
  }

  static async create ({ input }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      rate,
      genre
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() AS uuid')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(`
      INSERT INTO movies (id, title, year, director, duration, poster, rate)
      VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?)
    `, [title, year, director, duration, poster, rate])

      if (genre && genre.length > 0) {
        for (const genreName of genre) {
        // Buscar el ID del género por su nombre
          const [genres] = await connection.query(
            'SELECT id FROM genres WHERE LOWER(name) = ?',
            [genreName.toLowerCase()]
          )

          if (genres.length > 0) {
            const [{ id: genreId }] = genres
            // Insertar la relación película-género
            await connection.query(
              'INSERT INTO movies_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)',
              [uuid, genreId]
            )
          }
        }
      }
    } catch (error) {
      console.error(error)
      // do not return the error message directly,
      // as it may contain sensitive information
      throw new Error('Error inserting movie')

      // send the trace for debugging purposes to a logging service, for example
      // logError(error) / sendLog('error', 'Error inserting movie', { error })
    }

    const [movies] = await connection.query(`
      SELECT
        BIN_TO_UUID(m.id) AS id,
        m.title,
        m.year,
        m.director,
        m.duration,
        m.poster,
        m.rate,
        IF(
          COUNT(g.name) = 0,
          JSON_ARRAY(),
          JSON_ARRAYAGG(g.name)
        ) AS genres
      FROM movies m
      LEFT JOIN movies_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.id = UUID_TO_BIN(?)
      GROUP BY m.id
    `, [uuid])

    console.log(movies)

    if (movies.length === 0) {
      return null
    }

    return movies[0]
  }

  static async update ({ id, movieData }) {
    // 1. Verificar que la película existe
    const movie = await this.getById({ id })
    if (!movie) {
      return null
    }

    // 2. Construir dinámicamente el UPDATE solo con los campos que vienen en input
    const fields = []
    const values = []

    if (movieData.title !== undefined) {
      fields.push('title = ?')
      values.push(movieData.title)
    }
    if (movieData.year !== undefined) {
      fields.push('year = ?')
      values.push(movieData.year)
    }
    if (movieData.director !== undefined) {
      fields.push('director = ?')
      values.push(movieData.director)
    }
    if (movieData.duration !== undefined) {
      fields.push('duration = ?')
      values.push(movieData.duration)
    }
    if (movieData.poster !== undefined) {
      fields.push('poster = ?')
      values.push(movieData.poster)
    }
    if (movieData.rate !== undefined) {
      fields.push('rate = ?')
      values.push(movieData.rate)
    }

    try {
    // 3. Actualizar los campos de la película (si hay alguno)
      if (fields.length > 0) {
        values.push(id) // Agregar el ID al final para el WHERE
        await connection.query(
        `UPDATE movies SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
        values
        )
      }

      // 4. Actualizar géneros (si vienen en el movieData)
      if (movieData.genre !== undefined) {
      // Eliminar géneros existentes
        await connection.query(
          'DELETE FROM movies_genres WHERE movie_id = UUID_TO_BIN(?)',
          [id]
        )

        // Insertar los nuevos géneros
        if (movieData.genre.length > 0) {
          for (const genreName of movieData.genre) {
            const [genres] = await connection.query(
              'SELECT id FROM genres WHERE LOWER(name) = ?',
              [genreName.toLowerCase()]
            )

            if (genres.length > 0) {
              const [{ id: genreId }] = genres
              await connection.query(
                'INSERT INTO movies_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)',
                [id, genreId]
              )
            }
          }
        }
      }
    } catch (error) {
      console.error(error)
      throw new Error('Error updating movie')
    }

    // 5. Retornar la película actualizada
    return await this.getById({ id })
  }

  static async delete ({ id }) {
    // 1. Verificar que la película existe
    const movie = await this.getById({ id })
    if (!movie) {
      return false
    }

    try {
    // 2. Eliminar las relaciones en movies_genres (por la foreign key)
      await connection.query(
        'DELETE FROM movies_genres WHERE movie_id = UUID_TO_BIN(?)',
        [id]
      )

      // 3. Eliminar la película
      await connection.query(
        'DELETE FROM movies WHERE id = UUID_TO_BIN(?)',
        [id]
      )

      return true
    } catch (error) {
      console.error(error)
      throw new Error('Error deleting movie')
    }
  }
}

export default async function handler(req, res) {
  const { movieId, language = 'ko-KR' } = req.query
  const API_KEY = process.env.TMDB_API_KEY

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=${language}&append_to_response=videos`
    )
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie details' })
  }

  if (!movieId) {
    return res.status(400).json({ error: 'Movie ID is required' })
  }

  const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=${language}`
  const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.TMDB_API_KEY}&language=${language}`

  try {
    const movieResponse = await fetch(movieDetailsUrl)
    const movieData = await movieResponse.json()

    if (movieResponse.status !== 200) {
      return res.status(movieResponse.status).json(movieData)
    }

    const videosResponse = await fetch(videosUrl)
    const videosData = await videosResponse.json()

    if (videosResponse.status !== 200) {
      return res.status(videosResponse.status).json(videosData)
    }

    movieData.videos = videosData.results

    return res.status(200).json(movieData)
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default async function handler(req, res) {
  const { movieId, language } = req.query
  const API_KEY = process.env.TMDB_API_KEY

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=${language}`
    )
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video data' })
  }
}

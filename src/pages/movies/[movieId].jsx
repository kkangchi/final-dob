import { useState, useEffect } from 'react'
import {
  Flex,
  Wrap,
  WrapItem,
  Badge,
  Heading,
  Text,
  Box,
  Textarea,
  Button,
} from '@chakra-ui/react'
import { StarIcon, CalendarIcon, TimeIcon } from '@chakra-ui/icons'
import CustomSpinner from '../../components/CustomSpinner'
import VideoModal from '../../components/VideoModal'
import BackButton from '../../components/BackButton'
import timeFormatter from '../../utils/timeFormatter'
import dateFormatter from '../../utils/dateFormatter'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FaTrash, FaEdit } from 'react-icons/fa'
import { IconButton } from '@chakra-ui/react'

export default function MovieDetail({ query }) {
  const router = useRouter()
  const [movie, setMovie] = useState({})
  const [loading, setLoading] = useState(true)
  const [videoKey, setVideoKey] = useState(null)
  const [reviews, setReviews] = useState([])
  const [userReview, setUserReview] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const currentUser =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user'))
      : null
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editReviewText, setEditReviewText] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authStatus = localStorage.getItem('isLoggedIn')
      setIsAuthenticated(authStatus === 'true')

      if (authStatus !== 'true') {
        router.push('/login')
        return
      }

      const savedReviews =
        JSON.parse(localStorage.getItem(`reviews-${query.movieId}`)) || []
      setReviews(savedReviews)
      fetchMovie()
    }
  }, [query.movieId, router])

  const fetchMovie = async () => {
    try {
      // 영화 상세 정보 가져오기
      const detailRes = await fetch(
        `/api/movieDetails?movieId=${query.movieId}&language=ko-KR`
      )
      const movieData = await detailRes.json()

      // 한국어 줄거리가 없으면 영어로 시도
      if (!movieData.overview) {
        const englishRes = await fetch(
          `/api/movieDetails?movieId=${query.movieId}&language=en-US`
        )
        const englishData = await englishRes.json()
        movieData.overview = englishData.overview
      }

      // 한국어 비디오 검색
      let videoRes = await fetch(
        `/api/videos?movieId=${query.movieId}&language=ko-KR`
      )
      let videoData = await videoRes.json()

      // 한국어 비디오가 없으면 영어로 검색
      if (!videoData.results || videoData.results.length === 0) {
        videoRes = await fetch(
          `/api/videos?movieId=${query.movieId}&language=en-US`
        )
        videoData = await videoRes.json()
      }

      // 비디오 키 설정
      if (videoData?.results?.length > 0) {
        const video =
          videoData.results.find(
            (v) => v.type === 'Trailer' && v.site === 'YouTube'
          ) ||
          videoData.results.find(
            (v) => v.type === 'Teaser' && v.site === 'YouTube'
          ) ||
          videoData.results[0]

        setVideoKey(video?.key || null)
      } else {
        setVideoKey(null)
      }

      setMovie(movieData)
    } catch (error) {
      console.error('Error fetching movie data:', error)
      setVideoKey(null)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewChange = (e) => {
    setUserReview(e.target.value)
  }

  const handleSubmitReview = () => {
    if (userReview.trim()) {
      const newReview = {
        id: Date.now().toString(),
        review: userReview,
        userId: currentUser?.uid,
        createdAt: new Date().toISOString(),
      }

      const updatedReviews = [...reviews, newReview]
      setReviews(updatedReviews)
      localStorage.setItem(
        `reviews-${query.movieId}`,
        JSON.stringify(updatedReviews)
      )
      setUserReview('')
    }
  }

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = reviews.filter((review) => review.id !== reviewId)
    setReviews(updatedReviews)
    localStorage.setItem(
      `reviews-${query.movieId}`,
      JSON.stringify(updatedReviews)
    )
  }

  const handleEditReview = (reviewId) => {
    const reviewToEdit = reviews.find((review) => review.id === reviewId)
    setEditingReviewId(reviewId)
    setEditReviewText(reviewToEdit.review)
  }

  const handleSaveEdit = (reviewId) => {
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, review: editReviewText } : review
    )
    setReviews(updatedReviews)
    localStorage.setItem(
      `reviews-${query.movieId}`,
      JSON.stringify(updatedReviews)
    )
    setEditingReviewId(null)
    setEditReviewText('')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Flex
      position="relative"
      justify="center"
      align="center"
      height={{ base: 'auto', md: '100vh' }}
      maxHeight="100%"
      backgroundColor="dimgrey"
      backgroundBlendMode="multiply"
      backgroundImage={{
        base: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        md: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
      }}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
    >
      {loading ? (
        <CustomSpinner />
      ) : (
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          align={{ base: 'center', md: 'normal' }}
        >
          <Flex
            align="center"
            flexDirection="column"
            position="relative"
            margin={{ base: 0, md: '2rem' }}
            width="20rem"
          >
            <Box marginTop={{ base: '2rem', md: 0 }}>
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt={movie.title}
                width={384}
                height={576}
                style={{
                  objectFit: 'cover',
                  borderRadius: '1rem',
                  boxShadow: 'dark-lg',
                }}
              />
            </Box>
            <Wrap justify="center" margin="2rem 0">
              {movie.genres.map((genre) => (
                <WrapItem key={genre.id}>
                  <Badge>{genre.name}</Badge>
                </WrapItem>
              ))}
            </Wrap>
          </Flex>
          <Flex
            position="relative"
            flexDirection="column"
            padding={{ base: '1.5rem', md: '1.5rem' }}
            margin={{ base: 0, md: '2rem' }}
            height={{ base: 'auto', md: '30rem' }}
            width={{ base: '100%', md: '40rem' }}
            borderRadius={{ base: 0, md: '1rem' }}
            background="rgba(0, 0, 0, 0.6)"
            boxShadow="dark-lg"
          >
            <Heading
              color="white"
              textShadow="2px 0 4px black"
              textAlign={{ base: 'center', md: 'left' }}
              margin={{ base: '1rem auto', md: '1rem 0 0.5rem' }}
            >
              {movie.title}
            </Heading>
            <Flex
              width={{ base: '100%', md: '14rem' }}
              justify={{ base: 'space-evenly', md: 'space-between' }}
            >
              <Flex align="center">
                <CalendarIcon color="white" />
                <Text
                  color="white"
                  textShadow="2px 0 4px black"
                  marginLeft={1.5}
                >
                  {dateFormatter(movie.release_date)}
                </Text>
              </Flex>
              <Flex align="center">
                <TimeIcon color="white" />
                <Text
                  color="white"
                  textShadow="2px 0 4px black"
                  marginLeft={1.5}
                >
                  {timeFormatter(movie.runtime)}
                </Text>
              </Flex>
            </Flex>
            <Text
              as="em"
              fontSize="lg"
              color="gray.400"
              textShadow="2px 0 4px black"
              margin={{ base: '1rem auto', md: '1rem 0' }}
            >
              {movie.tagline}
            </Text>
            <Text
              height="100%"
              maxWidth="100%"
              color="white"
              fontSize="lg"
              textShadow="2px 0 4px black"
              marginBottom={{ base: '1.5rem', md: 0 }}
              overflowY={{ base: 'visible', md: 'auto' }}
            >
              {movie.overview}
            </Text>
            <Flex justify="space-evenly">
              <VideoModal videoKey={videoKey} />
              <BackButton />
            </Flex>
            <Flex align="flex-end" justify="space-between">
              <Flex align="center">
                <StarIcon boxSize={5} color="gold" />
                <Text fontSize="lg" color="white">
                  {movie.vote_average !== 0
                    ? Math.round(movie.vote_average * 10) / 10
                    : 'TBD'}
                </Text>
              </Flex>
              {movie.production_companies.slice(0, 1).map(
                (company) =>
                  company.logo_path && (
                    <Image
                      key={company.id}
                      alt={company.name}
                      src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                      width={64}
                      height={64}
                      style={{
                        margin: '0 1rem',
                        padding: '0.5rem',
                        borderRadius: '0.2rem',
                        background: 'white',
                      }}
                      onError={() => {}}
                    />
                  )
              )}
            </Flex>
          </Flex>
          <Box mt={6} p={4} bg="white" borderRadius="md" width="100%">
            <Textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="리뷰 작성해 주세요..."
              size="sm"
              mb={2}
            />
            <Button bg="#d5bed3" onClick={handleSubmitReview}>
              완료
            </Button>

            {reviews.length > 0 && (
              <Box mt={4}>
                <Heading size="md" mb={4}>
                  Reviews
                </Heading>
                {reviews.map((review) => (
                  <Flex
                    key={review.id}
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    boxShadow="sm"
                    mb={4}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box flex="1">
                      {editingReviewId === review.id ? (
                        <Textarea
                          value={editReviewText}
                          onChange={(e) => setEditReviewText(e.target.value)}
                          mb={2}
                        />
                      ) : (
                        <Text>{review.review}</Text>
                      )}
                      <Text fontSize="sm" color="gray.500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Text>
                    </Box>
                    {currentUser?.uid === review.userId && (
                      <Flex>
                        {editingReviewId === review.id ? (
                          <Button
                            colorScheme="green"
                            size="sm"
                            onClick={() => handleSaveEdit(review.id)}
                            mr={2}
                          >
                            저장
                          </Button>
                        ) : (
                          <IconButton
                            icon={<FaEdit />}
                            colorScheme="blue"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditReview(review.id)}
                            aria-label="Edit review"
                            mr={2}
                          />
                        )}
                        <IconButton
                          icon={<FaTrash />}
                          colorScheme="red"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                          aria-label="Delete review"
                        />
                      </Flex>
                    )}
                  </Flex>
                ))}
              </Box>
            )}
          </Box>
        </Flex>
      )}
    </Flex>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  }
}

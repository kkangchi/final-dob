// components/ReviewSection.jsx
import { useState } from 'react'
import { Box, Textarea, Button, Heading, Text } from '@chakra-ui/react'

export default function ReviewSection({ reviews, setReviews }) {
  const [userReview, setUserReview] = useState('')

  const handleReviewChange = (e) => {
    setUserReview(e.target.value)
  }

  const handleSubmitReview = () => {
    if (userReview) {
      setReviews([...reviews, userReview]) // 리뷰 추가
      setUserReview('') // 입력 필드 초기화
    }
  }

  return (
    <Box mt={6} p={4} bg="white" borderRadius="md" width="100%">
      {/* 리뷰 작성 부분 */}
      <Heading size="md">Write a Review</Heading>
      <Textarea
        value={userReview}
        onChange={handleReviewChange}
        placeholder="Write your review here..."
        size="sm"
        mb={2}
      />
      <Button colorScheme="blue" onClick={handleSubmitReview}>
        Submit Review
      </Button>

      {/* 저장된 리뷰 표시 */}
      {reviews.length > 0 && (
        <Box mt={4}>
          <Heading size="md">Your Reviews:</Heading>
          {reviews.map((review, index) => (
            <Text key={index} mt={2} p={2} bg="gray.100" borderRadius="md">
              {review}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  )
}

import { connectToDatabase } from '../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'POST':
      return handlePostReview(req, res)
    case 'DELETE':
      return handleDeleteReview(req, res)
    default:
      res.setHeader('Allow', ['POST', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

// 리뷰 작성 처리
async function handlePostReview(req, res) {
  const { movieId, review, userId, userName } = req.body

  if (!movieId || !review) {
    return res.status(400).json({ error: '영화 ID와 리뷰 내용이 필요합니다.' })
  }

  try {
    const { db } = await connectToDatabase()

    const reviewData = {
      movieId,
      review,
      userId: userId || 'anonymous',
      userName: userName || '익명',
      createdAt: new Date(),
    }

    const result = await db.collection('reviews').insertOne(reviewData)

    const savedReview = {
      id: result.insertedId,
      ...reviewData,
    }

    res.status(201).json({
      message: '리뷰가 성공적으로 저장되었습니다.',
      review: savedReview,
    })
  } catch (error) {
    console.error('리뷰 저장 중 오류 발생:', error)
    res.status(500).json({ error: '리뷰 저장에 실패했습니다.' })
  }
}

// 리뷰 삭제 처리
async function handleDeleteReview(req, res) {
  const { reviewId, userId } = req.query

  if (!reviewId) {
    return res.status(400).json({ error: '리뷰 ID가 필요합니다.' })
  }

  try {
    const { db } = await connectToDatabase()

    // 리뷰 찾기
    const review = await db.collection('reviews').findOne({
      _id: new ObjectId(reviewId),
    })

    // 리뷰가 존재하지 않는 경우
    if (!review) {
      return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' })
    }

    // 리뷰 작성자 확인 (옵션)
    if (userId && review.userId !== userId) {
      return res.status(403).json({ error: '리뷰를 삭제할 권한이 없습니다.' })
    }

    // 리뷰 삭제
    await db.collection('reviews').deleteOne({
      _id: new ObjectId(reviewId),
    })

    res.status(200).json({ message: '리뷰가 성공적으로 삭제되었습니다.' })
  } catch (error) {
    console.error('리뷰 삭제 중 오류 발생:', error)
    res.status(500).json({ error: '리뷰 삭제에 실패했습니다.' })
  }
}

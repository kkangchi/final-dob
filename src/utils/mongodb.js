// utils/mongodb.js
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI // MongoDB URI 환경 변수
let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  // 개발 환경에서는 MongoClient 인스턴스를 재사용합니다.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // 프로덕션 환경에서는 새로운 MongoClient 인스턴스를 만듭니다.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db('movie') // 사용할 데이터베이스 이름
  return { db, client }
}

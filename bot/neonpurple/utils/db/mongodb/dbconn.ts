import mongoose, {connect} from 'mongoose'
import {exit} from 'process'

mongoose.set('strictQuery', false)

export async function initMongoDB() {
  console.log('🚦 Connecting to mongodb database')

  try {
    let db = await connect(process.env.MONGO_URI)
    if (db) {
      console.log('✅ Connected to mongo database!')
    }
  } catch (e) {
    console.error('Something went wrong in the connection:', e)
    exit(1)
  }
}

import mongoose, {connect} from 'mongoose'
import {exit} from 'process'

mongoose.set('strictQuery', false)

export async function initMongoDB(mongoUri: string) {
  console.log('Connecting to mongodb...')
  try {
    let db = await connect(mongoUri)
    if (db) {
      console.log('Connected to mongo database!')
    }
  } catch (e) {
    console.error('Something went wrong:', e)
    exit(1)
  }
}

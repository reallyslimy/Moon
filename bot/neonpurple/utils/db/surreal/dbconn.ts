import Surreal from 'surrealdb.js'
import 'dotenv/config'
import {exit} from 'process'

export const db = new Surreal(process.env.SURREAL_DB_URL)

export async function initDB() {
  try {
    console.log('🚦 Initializing Surreal database...')
    if (
      !process.env.SURREAL_DB_USER ||
      !process.env.SURREAL_DB_PASS ||
      !process.env.SURREAL_DB_URL
    ) {
      console.error("Database Url, User or Password wasn't set")
      exit(1)
    }

    await db
      .connect(process.env.SURREAL_DB_URL)
      .then(() => console.log('✅ Connected to database'))
      .catch((err) => console.error('Error connecting to database', err))
    await db
      .signin({
        user: process.env.SURREAL_DB_USER,
        pass: process.env.SURREAL_DB_PASS,
      })
      .then((res) => console.log('👷‍♂️ Signed to database', res))
      .catch((err) => console.error('Error signing to the database', err))

    await db
      .use('test', 'test')
      .catch((err) => console.error("Couldn't select a database", err))
  } catch (e) {
    console.error('A problem was found: ', e)
    exit(1)
  }
}

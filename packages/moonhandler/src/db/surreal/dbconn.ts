import Surreal from 'surrealdb.js'
import {exit} from 'process'
import {createBotTable} from './CRUD/createTables'

export const db = new Surreal('http://127.0.0.1:8000/rpc')

export async function initSurrealDB(dbUser: string, dbPass: string) {
  try {
    console.log('Initializing SurrealDB...')

    await db
      .connect('http://127.0.0.1:8000/rpc')
      .then(() => console.log('Connected to SurrealDB'))
      .catch((err) => console.error('Error connecting to Surreal', err))

    await db
      .signin({
        user: dbUser,
        pass: dbPass,
      })
      .then((res) => console.log('Signed in to Surreal', res))
      .catch((err) => console.error('Error signing up to the database', err))

    await db
      .use('moon', 'neon')
      .catch((err) => console.error('Could not select a database', err))

    await createBotTable(db)
  } catch (e) {
    console.error('Problem found', e)
    exit(1)
  }
}

import Surreal from 'surrealdb.js'

export async function createBotTable(db: Surreal) {
  await db.create('neonproject', {
    guildID: '',
    name: 'Neon Purple',
    allowed: true,
  })
}

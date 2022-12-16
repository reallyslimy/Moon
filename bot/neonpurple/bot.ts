import Eris from 'eris'
import 'dotenv/config'
import {MoonClient} from 'moonhandler'

export const otype = Eris.Constants.ApplicationCommandOptionTypes

export const bot = new MoonClient(
  process.env.DISCORD_TOKEN,
  {
    intents: ['all'],
    maxShards: 'auto',
  },
  process.env.TEST_GUILD
)

// Define DB data
bot.dbEngine = process.env.DB_ENGINE
bot.surrealUser = process.env.SURREAL_DB_USER
bot.surrealPass = process.env.SURREAL_DB_PASS

bot.startBot()

import Eris from 'eris'
import 'dotenv/config'
import {MoonHandlerClient} from 'moonhandler'
import {initDB} from './utils/db/surreal/dbconn'
import {initMongoDB} from './utils/db/mongodb/dbconn'
import {dbEngine} from './utils/enums/dbEngine.enum'

export const otype = Eris.Constants.ApplicationCommandOptionTypes

export const bot = new MoonHandlerClient(
  process.env.DISCORD_TOKEN,
  {
    intents: ['all'],
  },
  process.env.TEST_GUILD
)

switch (process.env.DB_ENGINE) {
  case dbEngine.surreal:
    initDB()
    break
  case dbEngine.mongo:
    initMongoDB()
    break
}

bot.startBot()

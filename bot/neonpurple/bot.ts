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
bot.mongoURI = process.env.MONGO_URI

bot.startBot()

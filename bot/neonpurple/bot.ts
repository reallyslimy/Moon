import Eris from 'eris'
import 'dotenv/config'
import {MoonHandlerClient} from 'moonhandler'

export const otype = Eris.Constants.ApplicationCommandOptionTypes

export const bot = new MoonHandlerClient(
  process.env.DISCORD_TOKEN,
  {
    intents: ['all'],
  },
  process.env.TEST_GUILD
)

bot.startBot()

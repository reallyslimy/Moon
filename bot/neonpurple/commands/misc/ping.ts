import Eris from 'eris'
import {MoonCommand} from 'moonhandler'

export default new MoonCommand({
  name: 'ping',
  description: 'Testing Commands',
  type: Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  run: async ({interaction}) => {
    interaction.createMessage('pong!')
  },
})

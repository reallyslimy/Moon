import Eris from 'eris'
import {bot} from '../bot'
import {MoonEvent, CommandType} from 'moonhandler'

export default new MoonEvent('interactionCreate', async (interaction) => {
  if (interaction instanceof Eris.CommandInteraction) {
    const command: CommandType = bot.commands.get(interaction.data.name)

    if (!command) {
      return interaction.createFollowup('This command does not exists!')
    }

    return command.run({
      interaction,
      client: bot,
    })
  }
  if (interaction instanceof Eris.ComponentInteraction) {
    interaction.deferUpdate()
  }
})

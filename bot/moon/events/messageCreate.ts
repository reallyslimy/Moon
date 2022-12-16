import {bot} from '../bot'
import {Message} from 'eris'
import {MoonEvent, NickModel} from 'moonhandler'

export default new MoonEvent('messageCreate', (message: Message) => {
  const botCommands: string[] = [
    'Yo Moon',
    'Hey Moon',
    'Hello Moon',
    'Sup Moon',
  ]
  const referKeyWords: string[] = ['change', 'refer']
  if (message.author.bot) {
    return
  }

  botCommands.forEach((command) => {
    referKeyWords.forEach(async (key) => {
      if (message.content.toLowerCase().includes(command.toLowerCase())) {
        if (message.content.toLowerCase().includes(key.toLowerCase())) {
          const nick = message.content.toLowerCase().split(' ').pop()
          bot.createMessage(
            message.channel.id,
            `Ok, I'll refer you as: ${nick}`
          )
          const newNick = new NickModel({
            guildId: message.guildID,
            userId: message.author.id,
            nick: nick,
          })
          await newNick.save()
        }
        if (message.content.toLowerCase() === command.toLowerCase()) {
          const nick = await NickModel.where('userId')
            .equals(message.author.id)
            .select('nick')
            .distinct('nick')
          console.log(nick)
          if (!nick) {
            bot.createMessage(
              message.channel.id,
              `Yooo <@${message.author.id}>! How's it going?`
            )
          } else {
            bot.createMessage(
              message.channel.id,
              `Yooo ${nick}! How's it going?`
            )
          }
        }
      }
    })
  })
})

// Add that when a table exists doesn't create but modify
// Fix the duplicate message of the bot
// Fix that when you don't have a nickname use the @ instead

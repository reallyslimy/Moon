import Eris, {Client, ClientEvents} from 'eris'
import glob from 'fast-glob'
import path from 'path'
import {exit} from 'process'
import report from 'yurnalist'
import {yellow, red, green} from 'kolorist'
// Internal Imports
import {CommandType} from '../types/command'
import {MoonEvent} from './event'

export class MoonHandlerClient extends Client {
  botToken: string
  guildID: string
  commands: Map<string, CommandType> = new Map()

  constructor(token: string, botOptions: Eris.ClientOptions, guildID) {
    super(token, botOptions)
    this.botToken = token
    this.guildID = guildID
  }

  async importFile(filePath: string) {
    return (await import(filePath)).default
  }

  async refreshCommands(commands: CommandType[]) {
    const guildCommands = await this.guilds.get(this.guildID).getCommands()
    const guildCommandNames = guildCommands.map((command) => command.name)
    const commandNames = commands.map((command) => command.name)

    guildCommandNames.forEach(async (commandName) => {
      if (!commandNames.includes(commandName)) {
        await this.guilds.get(this.guildID).deleteCommand(commandName)
      }
    })

    await this.guilds
      .find((g) => g.id === this.guildID)
      .bulkEditCommands(commands)
  }

  async registerModules() {
    // Register commands
    const slashCommands: CommandType[] = []

    const commandFiles = await glob('**/*.{js,ts}', {
      cwd: path.join(process.cwd(), './commands'),
      ignore: ['node_modules'],
    })
    report.step(1, 3, yellow('🤖 Registering commands...'))
    commandFiles.forEach(async (filePath) => {
      console.log(filePath)
      const command: CommandType = await this.importFile(
        path.join(process.cwd(), `./commands/${filePath}`)
      )
      if (!command.name) {
        return
      }
      try {
        this.commands.set(command.name, command)
        report.step(2, 3, green('🥳 Commands registered!'))
        const transformedType = this.transformType(command.type)
        const array = [
          {
            name: command.name,
            type: transformedType,
            permissions: command.defaultPermission,
          },
        ]
        const transformed = array.reduce((acc, {name, ...x}) => {
          acc[name] = x
          return acc
        }, {})
        console.table(transformed)
      } catch (e) {
        console.error(red(`😢 Something went wrong: ${e}`))
        exit(1)
      }
      slashCommands.push(command)
    })

    this.on('ready', () => {
      this.refreshCommands(slashCommands)
    })

    // Register Events
    const eventFiles = await glob('**/*.{js,ts}', {
      cwd: path.join(process.cwd(), './events'),
      ignore: ['node_modules'],
    })
    eventFiles.forEach(async (filePath) => {
      const event: MoonEvent<keyof ClientEvents> = await this.importFile(
        path.join(process.cwd(), `./events/${filePath}`)
      )
      this.on(event.event, event.run)
    })
  }

  transformType(type: number) {
    switch (type) {
      case 1:
        return 'CHAT_INPUT'
      case 2:
        return 'USER'
      case 3:
        return 'MESSAGE'
    }
  }
  async startBot() {
    await this.registerModules()
    await this.connect()
  }
}

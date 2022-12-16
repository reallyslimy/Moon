import Eris, {Client, ClientEvents} from 'eris'
import glob from 'fast-glob'
import path from 'path'
import {exit} from 'process'
import report from 'yurnalist'
import {yellow, red, green} from 'kolorist'
// Internal Imports
import {CommandType} from '../types/command'
import {MoonEvent} from './event'
import {dbEngine} from '../utils/enums/dbEngine.enums'
import {initSurrealDB} from '../db/surreal/dbconn'
import {initMongoDB} from '../db/mongo/dbconn'

export class MoonClient extends Client {
  botToken: string
  guildID: string
  commands: Map<string, CommandType> = new Map()
  dbEngine?: string
  mongoURI?: string
  surrealUser?: string
  surrealPass?: string

  constructor(
    token: string,
    botOptions: Eris.ClientOptions,
    guildID,
    dbEngine?: string,
    mongoURI?: string,
    surrealUser?: string,
    surrealPass?: string
  ) {
    super(token, botOptions)
    this.botToken = token
    this.guildID = guildID
    this.dbEngine = dbEngine
    this.mongoURI = mongoURI
    this.surrealPass = surrealPass
    this.surrealUser = surrealUser
  }

  async importFile(filePath: string) {
    return (await import(filePath)).default
  }

  public async refreshCommands(commands: CommandType[]) {
    const guildCommands = await this.guilds.get(this.guildID).getCommands()
    const guildCommandNames = guildCommands.map((command) => command.name)
    const commandNames = commands.map((command) => command.name)

    guildCommandNames.forEach(async (commandName) => {
      console.log(
        'Command: ' + commandName,
        !commandNames.includes(commandName)
      )
      if (!commandNames.includes(commandName)) {
        await this.guilds.get(this.guildID).deleteCommand(commandName)
      }
    })
    await this.guilds
      .find((g) => g.id === this.guildID)
      .bulkEditCommands(commands)
  }

  public async registerModules() {
    // Register commands
    const slashCommands: CommandType[] = []

    const commandFiles = await glob('**/*.{js,ts}', {
      cwd: path.join(process.cwd(), './commands'),
      ignore: ['node_modules'],
    })
    report.step(1, 3, yellow('🤖 Registering commands...'))
    commandFiles.forEach(async (filePath) => {
      const command: CommandType = await this.importFile(
        path.join(process.cwd(), `./commands/${filePath}`)
      )
      if (!command.name) {
        return
      }
      try {
        this.commands.set(command.name, command)
      } catch (e) {
        console.error(red(`😢 Something went wrong: ${e}`))
        exit(1)
      }
      slashCommands.push(command)
    })

    this.on('ready', () => {
      this.refreshCommands(slashCommands)
      report.step(2, 3, green('🥳 Commands registered!'))
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

  async setDbEngine(engine: string) {
    if (!engine) {
      ;('A DBEngine was not provided, so the bot will start without database.')
    }

    switch (engine) {
      case dbEngine.surreal:
        initSurrealDB(this.surrealUser, this.surrealPass)
        break
      case dbEngine.mongo:
        initMongoDB(this.mongoURI)
        break
    }
  }

  public async startBot() {
    await this.registerModules()
    await this.setDbEngine(this.dbEngine)
    await this.connect()
  }
}

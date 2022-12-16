import {ApplicationCommandStructure, CommandInteraction} from 'eris'
import {MoonClient} from '../structures/client'

interface RunOptions {
  client: MoonClient
  interaction: CommandInteraction
}

type RunFunction = (options: RunOptions) => any

export type CommandType = ApplicationCommandStructure & {
  run: RunFunction
}

import {ApplicationCommandStructure, CommandInteraction} from 'eris'
import {MoonHandlerClient} from '../structures/client'

interface RunOptions {
  client: MoonHandlerClient
  interaction: CommandInteraction
}

type RunFunction = (options: RunOptions) => any

export type CommandType = ApplicationCommandStructure & {
  run: RunFunction
}

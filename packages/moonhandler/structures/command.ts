import {CommandType} from '../types/command'

export class MoonCommand {
  constructor(commandOptions: CommandType) {
    Object.assign(this, commandOptions)
  }
}

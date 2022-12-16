import {ClientEvents} from 'eris'

export class MoonEvent<Key extends keyof ClientEvents> {
  constructor(
    public event: Key,
    public run: (...args: ClientEvents[Key]) => any
  ) {}
}

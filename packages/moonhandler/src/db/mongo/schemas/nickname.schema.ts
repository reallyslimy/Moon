import {Schema, model} from 'mongoose'

const nickSchema = new Schema({
  guildId: String,
  userId: String,
  nick: String,
})

export const NickModel = model('Nicknames', nickSchema)

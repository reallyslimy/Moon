import mongoose from 'mongoose'
const {Schema} = mongoose

const moonSchema = new Schema({
  guildId: String,
  guildName: String,
  allowed: Boolean,
})

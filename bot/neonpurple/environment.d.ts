declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string
      TEST_GUILD: string
      ENV: 'dev' | 'prod' | 'debug'
      MONGO_URI: string
    }
  }
}

export {}

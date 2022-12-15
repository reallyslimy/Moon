declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string
      TEST_GUILD: string
      ENV: 'dev' | 'prod' | 'debug'
      SURREAL_DB_URL: string
      SURREAL_DB_USER: string;
      SURREAL_DB_PASS: string;
      DB_ENGINE: string;
      MONGO_URI: string;
    }
  }
}

export {}

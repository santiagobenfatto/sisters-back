import { createClient } from "@libsql/client"
import config from '../../config/config.js'

export const client = createClient({
  url: config.tursoDatabaseUrl,
  authToken: config.tursoAuthToken,
})
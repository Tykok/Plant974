import Specie from '@/types/specie'
import { createClient } from 'redis'

const getRedisClient = async () => await createClient({ url: process.env.REDIS_URL }).connect()

const saveSpecie = async (species: Specie[]) => {
  const client = await getRedisClient()
  await client.set('species', JSON.stringify(species))
  await client.disconnect()
}

export { saveSpecie }

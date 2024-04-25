import Specie from '@/types/specie'
import { createClient } from 'redis'

const getRedisClient = async () => await createClient({ url: process.env.REDIS_URL }).connect()

const saveSpecie = async (species: Specie[]) => {
  const client = await getRedisClient()
  // Clear all keys
  await client.flushAll()
  await client.set('species', JSON.stringify(species))
  await client.disconnect()
}

const pieChartProtectedSpecie = async (species: Specie[]) => {
  // Get all protected species and count them
  const numberOfProtectedSpecies = species.filter(specie => specie.description.isProtected).length
  const numberOfNotProtectedSpecies = species.length - numberOfProtectedSpecies
  const objectToSave = {
    protected: numberOfProtectedSpecies,
    notProtected: numberOfNotProtectedSpecies
  }
  // Save it to Redis
  const client = await getRedisClient()
  await client.set('protectedSpecies', JSON.stringify(objectToSave))
  await client.disconnect()
}

const barChartFamily = async (species: Specie[]) => {
  // Get all families and count them
  const families = species.map(specie => specie.family)
  const familiesCount = families.reduce((acc, family) => {
    if (!acc[family]) acc[family] = 0
    acc[family]++
    return acc
  }, {} as Record<string, number>)
  // Save it to Redis
  const client = await getRedisClient()
  await client.set('families', JSON.stringify(familiesCount))
  await client.disconnect()
}

export { saveSpecie, pieChartProtectedSpecie, barChartFamily }

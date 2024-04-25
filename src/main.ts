import 'dotenv/config'
import { getSpecie, getSpeciePageContent, getSpeciesLinks } from './utils/scrap'
import Specie from './types/specie'
import { barChartFamily, pieChartProtectedSpecie, saveSpecie } from './services/redisClient'

const main = async () => {
  const specieUrl = await getSpeciesLinks()
  const species: Specie[] = []

  for (let url of specieUrl) {
    const content = await getSpeciePageContent(url)
    const specie = await getSpecie(content)
    if (specie) species.push(specie)
  }
  saveSpecie(species)
  pieChartProtectedSpecie(species)
  barChartFamily(species)
}

main()

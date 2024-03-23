import 'dotenv/config'
import { getSpecie, getSpeciePageContent, getSpeciesLinks } from './utils/scrap'
import Specie from './types/specie'

const main = async () => {
  const specieUrl = await getSpeciesLinks()
  const species: Specie[] = []

  for (let url of specieUrl) {
    const content = await getSpeciePageContent(url)
    await getSpecie(content)
    // TODO Add console.log to see the progress
    // TODO When finish all test for one page push in this array species.push(specie)
    // TODO Implement a function who connect to a database and save the species
    break
  }
}

main()

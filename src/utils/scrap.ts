import { NoContentException } from '@/exceptions/FetchException'
import Specie, { Description, Multiplication } from '@/types/specie'
import { JSDOM } from 'jsdom'
import { getBreeding, getPheneology } from './pictureScrap'

// TODO All functions who clean texts should return an array of strings with a substring at any point (.)

/**
 * Scrap all Species links in the main pages and return and array of links
 */
const getSpeciesLinks = async (): Promise<string[]> =>
  JSDOM.fromURL(`${process.env.WEBSITE_BASE_URL}/especes.html`)
    .then((dom: JSDOM) => dom.serialize())
    // Get the list of all species
    .then((serializedDom: string) => new JSDOM(serializedDom).window.document.getElementById('container'))
    // Get all links of species
    .then((container: HTMLElement | null) => {
      if (!container) {
        throw new NoContentException()
      }
      const speciesLinks = container.querySelectorAll('a')
      const cleanUrls: string[] = []
      speciesLinks.forEach((link: HTMLAnchorElement) => {
        if (link.href.includes('especes')) cleanUrls.push(link.href)
      })
      return cleanUrls.filter((url, index, self) => self.indexOf(url) === index)
    })

/**
 * Scrap the content of a specie page and return it as a string
 */
const getSpeciePageContent = async (url: string): Promise<string> => {
  const specieUrl = `${process.env.WEBSITE_BASE_URL}/${url}`
  return JSDOM.fromURL(specieUrl).then((dom: JSDOM) => dom.serialize())
}

/**
 * Format and clean the content of a specie page and return it as a Specie object
 */
const getSpecie = async (content: string): Promise<Specie | null> => {
  const dom = new JSDOM(content).window.document.querySelector('#contenu')!
  const name = cleantext(dom.querySelector('h1')?.textContent?.trim())!
  try {
    const family = cleantext(dom.querySelector('h2')?.nextSibling?.textContent?.trim())!
    const synonyms = cleantext(dom.querySelector('.synonymes')?.textContent?.trim())!
    const commonNames = cleantext(dom.querySelector('.nom_commun')?.textContent?.trim())!
    const description = descriptionCleaner(dom.querySelector('.description')?.textContent?.trim()!)!
    const multiplication = multiplicationCleaner(dom.querySelector('.multiplication')?.textContent?.trim()!)!

    const pheneologieUrl = getUrl(dom, '.phenologie', '.pheno')
    const pheneology = !!pheneologieUrl ? await getPheneology(pheneologieUrl) : { flowerings: new Map(), harvesteds: new Map() }
    const breedingUrl = getUrl(dom, '.elevage', '.chrono')
    const breeding = !!breedingUrl ? await getBreeding(breedingUrl) : { survey: new Map(), transplant: new Map(), breeding: new Map() }

    const pictureUrls: string[] = []
    const picturesSection = dom.querySelector('.section')?.querySelector('ul')
    picturesSection?.querySelectorAll('li').forEach((li: Element) => {
      const pictureUrl = li.querySelector('a')?.href
      if (pictureUrl) {
        pictureUrls.push(`${process.env.WEBSITE_BASE_URL}/${pictureUrl.substring(6)}`)
      }
    })

    const specie = {
      name,
      family,
      synonyms,
      commonNames,
      description,
      multiplication,
      ...breeding,
      ...pheneology,
      pictureUrls
    }
    console.log(`${name} ✅`)
    return specie
  } catch (e) {
    console.log(e)
    console.log(`${name} ❌`)
    return null
  }
}

const getUrl = (page: Element, parentClass: string, childClasses: string) => {
  const phenoDivs = page.querySelector(parentClass)?.querySelectorAll(childClasses)
  let url = ''
  phenoDivs?.forEach((pheno: Element) => {
    // Check if the element contains a a href url
    const href = pheno.querySelector('a')?.href
    if (href) {
      url = href
    }
  })
  if (url.length > 0) {
    return `${process.env.WEBSITE_BASE_URL}/${url.substring(6)}`
  } else {
    return null
  }
}

const descriptionCleaner = (text: string): Description => {
  const leafRegex = /Feuilles\s*:\s*([\s\S]*?)Stipules\s*:/
  const venationRegex = /Nervation\s*:\s*([\s\S]*?)Inflorescences\s*:/
  const inflorescencesRegex = /Inflorescences\s*:\s*([\s\S]*?)Fleurs\s*:/
  const flowersRegex = /Fleurs\s*:\s*([\s\S]*?)Fruits\s*:/
  const fruitRegex = /Fruits\s*:\s*([\s\S]*?)Graines\s*:/
  const seedRegex = /Graines\s*:\s*([\s\S]*?)Écologie\s+et\s+répartition\s*:/
  const ecologyAndDistributionRegex = /Écologie\s+et\s+répartition\s*:\s*([\s\S]*?)Utilisations\s*:/
  const utilisationRegex = /Utilisations\s*:\s*([\s\S]*?)Espèce\s+protégée/

  return {
    leaf: matchAndClean(leafRegex, text),
    venation: matchAndClean(venationRegex, text),
    inflorescences: matchAndClean(inflorescencesRegex, text),
    flowers: matchAndClean(flowersRegex, text),
    fruit: matchAndClean(fruitRegex, text),
    seed: matchAndClean(seedRegex, text),
    ecologyAndDistribution: matchAndClean(ecologyAndDistributionRegex, text),
    utilisation: matchAndClean(utilisationRegex, text),
    isProtected: text.includes('Espèce protégée')
  }
}

const multiplicationCleaner = (text: string): Multiplication => {
  const harvestRegex = /Récolte\s*:\s*([\s\S]*?)Préparation\s+des\s+semences\s*:/
  const seedPreparationRegex = /Préparation\s+des\s+semences\s*:\s*([\s\S]*?)Dormance\s*:/
  const dormancyRegex = /Dormance\s*:\s*([\s\S]*?)Conservation\s*:/
  const conservationRegex = /Conservation\s*:\s*([\s\S]*?)Semis\s*:/
  const sowingRegex = /Semis\s*:\s*([\s\S]*?)Nombre\s+de\s+graines\/kg\s*:/
  const seedNumberInKgRegex = /Nombre\s+de\s+graines\/kg\s*:\s*([\s\S]*?)Taux\s+de\s+germination\s*:/
  const germinationRateRegex = /Taux\s+de\s+germination\s*:\s*([\s\S]*?)Elevage\s+des\s+plants\s*:/
  const plantBreedingRegex = /Elevage\s+des\s+plants\s*:\s*([\s\S]*)/

  return {
    harvest: matchAndClean(harvestRegex, text),
    seedPreparation: matchAndClean(seedPreparationRegex, text),
    dormancy: matchAndClean(dormancyRegex, text),
    conservation: matchAndClean(conservationRegex, text),
    sowing: matchAndClean(sowingRegex, text),
    seedNumberInKg: parseInt(matchAndClean(seedNumberInKgRegex, text)?.match(/\d+/)?.at(0) || '0', 10),
    germinationRate: parseFloat(matchAndClean(germinationRateRegex, text)?.match(/\d+/)?.at(0) || '0'),
    plantBreeding: matchAndClean(plantBreedingRegex, text)
  }
}

const matchAndClean = (match: RegExp, text: string) => cleantext(text?.match(match)?.at(1))

const cleantext = (text?: string) =>
  text
    ?.replace(/\n/g, '')
    .replace(/\[\?\]/g, '')
    .replace(/\s{2,}/g, ' ') // Delete many espaces
    .replace(/(\d)\s(?=\d)/g, '$1') // Remove espace between numbers (used to convert it next)
    .trim()

export { getSpeciesLinks, getSpeciePageContent, getSpecie }

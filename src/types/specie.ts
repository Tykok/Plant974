type Specie = {
  name: string
  family: string

  // FIXME Maybe change it to []
  synonyms: string
  // FIXME Maybe change it to []
  commonNames: string
  pictureUrls: string[]
  description: Description
  multiplication?: Multiplication

  //Phenology
  flowerings: Map<Months, boolean>
  harvesteds: Map<Months, boolean>

  // Breeding
  survey?: Map<Number, boolean>
  transplant?: Map<Number, boolean>
  breeding?: Map<Number, boolean>
}

enum Months {
  JANUARY,
  FEBRUARY,
  MARCH,
  APRIL,
  MAY,
  JUNE,
  JULY,
  AUGUST,
  SEPTEMBER,
  OCTOBER,
  NOVEMBER,
  DECEMBER
}

type Description = {
  leaf?: string
  venation?: string
  inflorescences?: string
  flowers?: string
  fruit?: string
  seed?: string
  ecologyAndDistribution?: string
  utilisation?: string
  isProtected: boolean
}

type Multiplication = {
  harvest?: string
  seedPreparation?: string
  dormancy?: string
  conservation?: string
  sowing?: string
  seedNumberInKg: number
  germinationRate: number
  plantBreeding?: string
}

export default Specie
export { Description, Multiplication, Months }

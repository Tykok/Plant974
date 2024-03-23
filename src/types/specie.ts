type FixedArray<T, Length extends number> = [T, ...T[]] & { length: Length }

type Specie = {
  name: string
  family: string
  synonyms: string[]
  commonNames: string[]
  pictureUrls: string[]
  description: Description
  multiplication?: Multiplication

  //Phenology
  flowerings?: FixedArray<FloweringPeriod, 12>
  harvesteds?: FixedArray<HarvestedPeriod, 12>

  // Breeding
  survey?: Period
  transplant?: Period
  breeding?: Period
}

type FloweringPeriod = { [key in Months]: boolean }
type HarvestedPeriod = { [key in Months]: boolean }

type Period = {
  startAt: number
  endAt: number
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
export { Description, Multiplication }

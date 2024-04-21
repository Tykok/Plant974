import Specie, { Months } from '@/types/specie'
import Jimp from 'jimp'

const fisrtColumnPheneology = 80
const celluleWidthPheneology = 22
const celluleHeightPheneology = 17

const firstColumnBreeding = 120
const celluleWidthBreeding = 19
const celluleHeightBreeding = 17

const getBreeding = async (url: string): Promise<Pick<Specie, 'survey' | 'transplant' | 'breeding'>> => {
  const surveys: Map<Number, boolean> = new Map<Number, boolean>()
  const transplants: Map<Number, boolean> = new Map<Number, boolean>()
  const breedings: Map<Number, boolean> = new Map<Number, boolean>()

  const picture = await Jimp.read(url).then(picture => {
    const croppedPicture = picture.crop(firstColumnBreeding, 0, picture.getWidth() - firstColumnBreeding, picture.getHeight())
    croppedPicture.write('results/breeding/months.jpg')
    return croppedPicture
  })

  let croppedPicture = picture
  let columnIndex = 0
  do {
    try {
      // FIXME Add NodeEnv to write OR NOT the pictures
      const newCroppedPicture = await Jimp.read(croppedPicture).then(picture => {
        // Check de la couleur de la ligne 2
        const secondLineColor = getHexColor(picture.getPixelColor(5, celluleHeightBreeding + 5))
        picture.setPixelColor(Jimp.cssColorToHex('#2596be'), 5, celluleHeightBreeding + 5)
        surveys.set(columnIndex, isYellow(secondLineColor.r, secondLineColor.g, secondLineColor.b))

        // Check de la couleur de la ligne 3
        const thridLineColor = getHexColor(picture.getPixelColor(5, (celluleHeightBreeding + 5) * 2))
        picture.setPixelColor(Jimp.cssColorToHex('#2596be'), 5, (celluleHeightBreeding + 5) * 2)
        transplants.set(columnIndex, isBrown(thridLineColor.r, thridLineColor.g, thridLineColor.b))

        // Check de la couleur de la ligne 4
        const fourthLineColor = getHexColor(picture.getPixelColor(5, (celluleHeightBreeding + 1) * 3))
        picture.setPixelColor(Jimp.cssColorToHex('#2596be'), 5, (celluleHeightBreeding + 1) * 3)
        breedings.set(columnIndex, fourthLineColor.r >= 100 && fourthLineColor.g <= 100 && fourthLineColor.b <= 25)

        picture.write(`results/breeding/${columnIndex}_coloredPixel.jpg`)

        // Crop the first column when all checks are done
        picture.crop(celluleWidthBreeding, 0, picture.getWidth() - celluleWidthBreeding, picture.getHeight())
        picture.write(`results/breeding/${columnIndex}.jpg`)

        return picture
      })
      croppedPicture = newCroppedPicture
      columnIndex++
    } catch (e) {
      break
    }
  } while (croppedPicture.getWidth() > 0)

  return { survey: surveys, transplant: transplants, breeding: breedings }
}

const getPheneology = async (url: string): Promise<Pick<Specie, 'flowerings' | 'harvesteds'>> => {
  const flowerings: Map<Months, boolean> = new Map<Months, boolean>()
  const harvesteds: Map<Months, boolean> = new Map<Months, boolean>()

  const picture = await Jimp.read(url).then(picture => {
    const croppedPicture = picture.crop(fisrtColumnPheneology, 0, picture.getWidth() - fisrtColumnPheneology, picture.getHeight())
    croppedPicture.write('results/breeding/months.jpg')
    return croppedPicture
  })

  let croppedPicture = picture
  for (let i = 0; i <= 11; i++) {
    // FIXME Add NodeEnv to write OR NOT the pictures
    const newCroppedPicture = await Jimp.read(croppedPicture).then(picture => {
      // Check de la couleur de la ligne 2
      const secondLineColor = getHexColor(picture.getPixelColor(5, celluleHeightPheneology + 5))
      picture.setPixelColor(Jimp.cssColorToHex('#2596be'), 5, celluleHeightPheneology + 5)
      flowerings.set(i, isYellow(secondLineColor.r, secondLineColor.g, secondLineColor.b))

      // Check de la couleur de la ligne 3
      const rgbPixel = getHexColor(picture.getPixelColor(5, (celluleHeightPheneology + 5) * 2))
      picture.setPixelColor(Jimp.cssColorToHex('#2596be'), 5, (celluleHeightPheneology + 5) * 2)
      harvesteds.set(i, isBrown(rgbPixel.r, rgbPixel.g, rgbPixel.b))
      picture.write(`results/${i}_coloredPixel.jpg`)

      // Crop the first column when all checks are done
      picture.crop(celluleWidthPheneology, 0, picture.getWidth() - celluleWidthPheneology, picture.getHeight())
      picture.write(`results/${i}.jpg`)

      return picture
    })
    croppedPicture = newCroppedPicture
  }

  return { flowerings, harvesteds }
}

const getHexColor = (color: number) => Jimp.intToRGBA(color)

const isBrown = (r: number, g: number, b: number) => {
  const redLimit = 128
  const greenLimit = 50
  const blueLimit = 70
  return r >= redLimit && g >= greenLimit && b <= blueLimit
}

const isYellow = (r: number, g: number, b: number) => {
  const redLimit = 255
  const greenLimit = 255
  const blueLimit = 60
  return r <= redLimit && g <= greenLimit && b <= blueLimit
}

export { getPheneology, getBreeding }

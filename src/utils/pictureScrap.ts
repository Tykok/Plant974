import Specie, { Months } from '@/types/specie'
import Jimp from 'jimp'

const fisrtColumn = 80
const celluleWidth = 22
const celluleHeight = 17

const pictureScrap = async (url: string) =>
  Jimp.read(url).then(picture => {
    const croppedPicture = picture.crop(fisrtColumn, 0, picture.getWidth() - fisrtColumn, picture.getHeight())
    croppedPicture.write('results/months.jpg')
    return croppedPicture
  })

const getPheneology = async (picture: Jimp): Promise<Pick<Specie, 'flowerings' | 'harvesteds'>> => {
  const flowerings: Map<Months, boolean> = new Map<Months, boolean>()
  const harvesteds: Map<Months, boolean> = new Map<Months, boolean>()

  let croppedPicture = picture
  for (let i = 0; i <= 11; i++) {
    // FIXME Add NodeEnv to write OR NOT the pictures
    const newCroppedPicture = await Jimp.read(croppedPicture).then(picture => {
      // Check de la couleur de la ligne 2
      const secondLineColor = getHexColor(picture.getPixelColor(5, celluleHeight + 5))
      picture.setPixelColor(Jimp.cssColorToHex('#2596be'), 5, celluleHeight + 5)
      flowerings.set(i, isYellow(secondLineColor.r, secondLineColor.g, secondLineColor.b))

      // Check de la couleur de la ligne 3
      const rgbPixel = getHexColor(picture.getPixelColor(5, (celluleHeight + 5) * 2))
      picture.setPixelColor(Jimp.cssColorToHex('#2596be'), 5, (celluleHeight + 5) * 2)
      harvesteds.set(i, isBrown(rgbPixel.r, rgbPixel.g, rgbPixel.b))
      picture.write(`results/${i}_coloredPixel.jpg`)

      // Crop the first column when all checks are done
      picture.crop(celluleWidth, 0, picture.getWidth() - celluleWidth, picture.getHeight())
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

export { pictureScrap, getPheneology }

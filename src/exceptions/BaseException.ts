abstract class BaseException extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export default BaseException

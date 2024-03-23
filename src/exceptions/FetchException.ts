import BaseException from './BaseException'

abstract class FetchException extends BaseException {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

class NoContentException extends FetchException {
  constructor(message: string = 'The content is empty') {
    super(message)
  }
}

export { NoContentException }

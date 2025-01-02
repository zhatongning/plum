import { bumpVersion } from './version-update.js'
import { handleException } from './utils/exception.js'

export const run = async () => {
  handleException()
  await bumpVersion()
}

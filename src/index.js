import { bumpVersion } from './version-updater.js'
import { handleException } from './utils/exception.js'
import { generateTag } from './tag-generator.js'

export const run = async () => {
  handleException()
  await bumpVersion()
  await generateTag()
}

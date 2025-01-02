import path from 'node:path'
import fse from 'fs-extra/esm'

export const findPkg = async (dir) => {
  const pkgPath = path.join(dir, 'package.json')
  if (await fse.pathExists(pkgPath)) {
    return pkgPath
  }
  const parentDir = path.dirname(dir)
  if (parentDir === dir) {
    return null
  }
  return findPkg(parentDir)
}

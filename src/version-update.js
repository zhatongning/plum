import semver from 'semver'
import process from 'node:process'
import fse from 'fs-extra/esm'
import chalk from 'chalk'
import {
  isPreReleaseVersion,
  doPreReleaseVersionPrompt,
  doStandardVersionPrompt,
} from './utils/version.js'
import { findPkg } from './utils/file.js'

export const bumpVersion = async () => {
  const result = await findPkg(process.cwd())
  if (!result) {
    console.log(
      chalk.bgCyan('[Plum]'),
      chalk.gray('\u{1F198} 当前不在一个 npm 项目目录下')
    )
    return
  }
  let pkg
  try {
    pkg = await fse.readJson(result)
  } catch (error) {
    console.log(
      chalk.bgCyan('[Plum]'),
      chalk.red('\u{1F6AB} 读取 package.json 失败')
    )
    return
  }
  const version = pkg.version
  if (!semver.valid(version, false)) {
    console.log(chalk.bgCyan('[Plum]'), chalk.red('\u{1F6AB} 版本号不合法'))
    return
  }

  let newVersion = version
  if (isPreReleaseVersion(version)) {
    const preRelease = semver.prerelease(version)
    const answer = await doPreReleaseVersionPrompt()
    if (answer === 'prerelease') {
      newVersion = semver.inc(version, 'prerelease')
    } else {
      newVersion = semver.inc(version, answer)
      newVersion = semver.inc(newVersion, 'prerelease', preRelease[0])
    }
  } else {
    const answer = await doStandardVersionPrompt()
    newVersion = semver.inc(version, answer)
  }
  try {
    await fse.writeJson(result, { ...pkg, version: newVersion }, { spaces: 2 })
    console.log(
      chalk.bgCyan('[Plum]'),
      chalk.green(`\u{1F4A5} 版本号已升级为 ${newVersion}`)
    )
  } catch (error) {
    console.log(
      chalk.bgCyan('[Plum]'),
      chalk.red('\u{1F6AB} 写入 package.json 失败')
    )
    return
  }
}

import chalk from 'chalk'
import { simpleGit } from 'simple-git'
import fse from 'fs-extra/esm'
import { log } from './utils/log.js'
import { findPkg } from './utils/file.js'

const onlyChoreFiles = (fileName) => {
  const choreFiles = [
    'package.json',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
  ]
  return choreFiles.includes(fileName)
}

const roadmapDesc = [
  '暂存区提交',
  '分支推送',
  'tag创建',
  'tag推送',
  '本地tag删除',
]

export const generateTag = async () => {
  let step = -1
  const sGit = simpleGit({
    errors(error, result) {
      if (error) {
        log(
          chalk.red(
            `🚫【${roadmapDesc[step + 1]}】 过程出现异常，已终止后续操作`
          )
        )
        log(chalk.red(`🚫【错误信息】${error.message}`))
        process.exit(0)
      }
      // ignore
    },
    timeout: {
      block: 10000,
    },
  })
  const diff = await sGit.diff(['--name-only', process.cwd()])
  const diffFiles = diff.split(/[\r\n]/).filter(Boolean)
  const isAChoreCommit = diffFiles.every(onlyChoreFiles)
  if (isAChoreCommit) {
    const pkgPath = await findPkg(process.cwd())
    const packageJson = await fse.readJson(pkgPath)
    try {
      // 1. 保存文件，并提交一条commit，默认的commit message 为 bump version@[version in package.json]
      const version = packageJson.version
      await sGit.add('.')
      await sGit.commit(`chore: bump version@${version}`)
      step++
      log('🚀 commit已创建')
      // 2. 将所在分支提交到远端
      await sGit.push('origin', 'HEAD')
      step++
      const currentBranch = await sGit.branch()
      log(`🚀 分支 ${currentBranch.current} 已推送到远端`)
      // 3. 以package.json中的version为版本生成一个tag
      await sGit.addTag(`${version}`)
      step++
      log(`🚀 tag@${version} 已创建`)
      // 4. 将tag推到远端
      await sGit.push('origin', `${version}`)
      step++
      log(`🚀 tag@${version} 已推送`)
      // 5. 完成
      log('🥳 恭喜，可以去喝杯水了~')
    } catch (error) {
      // sGit的异常处理已经在初始化时设置，这里不需要再处理
    }
  } else {
    log('🤓 你还有暂未保存的功能文件')
  }
}

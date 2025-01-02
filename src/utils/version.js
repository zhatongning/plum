import semver from 'semver'
import { select } from '@inquirer/prompts'

export const isPreReleaseVersion = (version) => {
  return semver.parse(version)?.prerelease.length > 0
}

const standardVersionOptions = [
  { title: '主版本号', value: 'major' },
  { title: '次版本号', value: 'minor' },
  { title: '补丁号', value: 'patch' },
]

const prereleaseVersionOptions = [
  ...standardVersionOptions,
  { title: '预发布版本', value: 'prerelease', options: {} },
]

export const doStandardVersionPrompt = async () => {
  return await select({
    type: 'select',
    name: 'version',
    message: '请选择版本类型',
    choices: standardVersionOptions,
  })
}

export const doPreReleaseVersionPrompt = async () => {
  return await select({
    type: 'select',
    name: 'version',
    message: '请选择版本类型',
    choices: prereleaseVersionOptions,
  })
}
